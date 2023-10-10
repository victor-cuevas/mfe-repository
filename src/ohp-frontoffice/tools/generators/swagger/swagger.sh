#!/usr/bin/env sh

# Exit immediately if function returns a non-zero status
set -e

VERSION="2.0"
PWD=$(pwd)
SCRIPTS_PATH=$(dirname "$0")
. "$SCRIPTS_PATH/help.sh"

################################################################################
# Capture Arguments                                                            #
################################################################################

ARGS=$(getopt -a --options "n:c:s:u:a:vh" --long "name:,client:,stage:,swaggerUrl:,apiLib:,version,help" -n Generate-API -- "$@")

eval set -- "$ARGS"

while true; do
  case "$1" in
    -n|--name)
      MFE_NAME="$2"
      shift 2;;
    -c|--client)
      CLIENT="$2"
      shift 2;;
    -s|--stage)
      STAGE="$2"
      shift 2;;
    -u|--swaggerUrl)
      SWAGGER_URL="$2"
      shift 2;;
    -a|--apiLib)
      API_LIB_NAME="$2"
      shift 2;;
    -v|--version)
      echo "version: $VERSION"; exit;;
    -h|--help)
      help;exit;;
    --)
      break;;
  esac
done

## Mandatory parameters
if [ -z "$MFE_NAME" ]; then
  echo -e "\033[31;1m Missing parameter --name"
  exit 1
fi

# TODO: enable the swagger_version parameter once the api definition is handled in our repo

# if [ -z "$SWAGGER_VERSION" ]; then
#   print_error "Missing parameter --origin"
#   exit 1
# fi

################################################################################
# Variables                                                                    #
################################################################################

if [ -z "$API_LIB_NAME" ]; then
  API_LIB_NAME="api"
fi

if [[ "$MFE_NAME" == *"broker"*  ]]; then
  LIB_PARENT="mfe-broker/$MFE_NAME"
  LIB_PATH="libs/$LIB_PARENT/$API_LIB_NAME"
else
  LIB_PARENT="$MFE_NAME"
  LIB_PATH="libs/$LIB_PARENT/$API_LIB_NAME"
fi

if [ -z "$CLIENT" ]; then
  CLIENT="team"
fi

if [ -z "$STAGE" ]; then
  STAGE="dev"
fi

TEMP_FOLDER="swagger-generator-temp"
SWAGGER_ORIGIN="$TEMP_FOLDER/swagger.json"
ANGULAR_VERSION=$(jq -r '.dependencies."@angular/common"' "$PWD/package.json")

################################################################################
# Functions                                                                    #
################################################################################

# This function creates the library folder with all the necesary contents
create_api_library () {
  # Generate API Library for the MFE
  echo -e "\nSimulating new API Library\n"
  nx g @nrwl/angular:library "$API_LIB_NAME" --directory="$LIB_PARENT" --standaloneConfig=true --dry-run

  while true; do
    read -p "The previous changes will be applied. Do you want to procede [Y/n]? " yn
    case $yn in
        [Yy]* | "" ) echo "Yes"; break;;
        [Nn]* ) echo "Aborting" ; exit;;
        * ) echo "Please answer yes or no.";;
    esac
  done

  echo -e "\nCreating API Library\n"
  nx g @nrwl/angular:library "$API_LIB_NAME" --directory="$LIB_PARENT" --standaloneConfig=true

  # Remove unnecessary files
  echo -e "\nEmptying $LIB_PATH/src"
  rm -r $LIB_PATH/src
  mkdir $LIB_PATH/src
  echo "Emptied src folder."

  # Create api.json file and replace project.json
  echo -e "\ncopying api.json from $SCRIPTS_PATH/templates/api.json to $LIB_PATH"
  cp $SCRIPTS_PATH/templates/api.json $LIB_PATH

  echo "copying project.json from $SCRIPTS_PATH/templates/project.json to $LIB_PATH"
  cp $SCRIPTS_PATH/templates/project.json $LIB_PATH

  echo -e "\nreplacing template values:"
  echo "    <lib_path> => $LIB_PATH"
  sed -i -e "s|<lib_path>|$LIB_PATH|g" $LIB_PATH/project.json

  echo -e "\n    \U2705 The new library has been created"
}

################################################################################
################################################################################
# Main program                                                                 #
################################################################################
################################################################################


echo -e "\n\033[1;34mGenerate New API Library\033[0m"
echo -e "Checking existing libraries in workspace.json"

# Search in workspace.json if the library already exists
if grep -q "$MFE_NAME-api\"" ./workspace.json
then
  echo -e "\nFound existing library in workspace.json: $MFE_NAME-api"
  echo -e "Will replace the existing parts of the library with the new definition\n"
else
  echo "$MFE_NAME-api doesn't exist yet."
  create_api_library
fi

# Obtain API URL from config
if [ -z "$SWAGGER_URL" ]; then
  CONFIG="$PWD/../../terraform/configuration/$CLIENT/$STAGE/config.json"
  echo -e "Retrieving Swagger URL from $CLIENT/$STAGE config\n"

  # Capitalise all words but the first and remove dashes
  REMOTE_NAME=$(echo "$MFE_NAME" | awk 'BEGIN{FS=OFS="-"} {for (i=2;i<=NF;i++) {$i=toupper(substr($i,1,1)) substr($i,2)}}1')
  REMOTE_NAME=$(echo "$REMOTE_NAME" | sed 's/-//g')

  SWAGGER_URL=$(jq -r --arg REMOTE_NAME "$REMOTE_NAME" '.REMOTE_MFES[] | select(.remoteName==$REMOTE_NAME) | .apiUrl' $CONFIG)
fi
# Append swagger endpoint to the provided URL
SWAGGER_URL="$SWAGGER_URL/swagger/v1/swagger.json"

# DOWNLOAD SWAGGER.JSON
mkdir -p "$TEMP_FOLDER"
echo -e "Fetching API specification from $SWAGGER_URL\n"
curl "$SWAGGER_URL" -o "$SWAGGER_ORIGIN"

# Copy swagger file into library root
echo -e "\ncopying swagger.json to $LIB_PATH"
cp $SWAGGER_ORIGIN $LIB_PATH/swagger.json

# Clean up servers field in swagger.json
jq 'del(.servers)' $LIB_PATH/swagger.json > $LIB_PATH/swagger.json.tmp && mv $LIB_PATH/swagger.json.tmp $LIB_PATH/swagger.json

# Copy and update README.md
echo "copying README.md from $SCRIPTS_PATH/templates/README.md to $LIB_PATH"
cp $SCRIPTS_PATH/templates/README.md $LIB_PATH

TIME=$(date +"%d/%m/%Y at %r")

echo -e "\nreplacing template values:"
echo "    <swagger_origin>  => $SWAGGER_URL"
echo "    <lib_path>        => $LIB_PATH"
echo "    <ANGULAR_VERSION> => $ANGULAR_VERSION"
echo "    <time_stamp>      => $TIME"
sed -i -e "s|<swagger_origin>|$SWAGGER_URL|g" -e "s|<lib_path>|$LIB_PATH|g" -e "s|<ANGULAR_VERSION>|$ANGULAR_VERSION|g" -e "s|<time_stamp>|$TIME|" $LIB_PATH/README.md

# Save old src/index.ts file
# File will only exist if the library is not new
OLD_INDEX_FILE="$LIB_PATH/src/index.ts"
if [[ -f "$OLD_INDEX_FILE" ]]; then
  echo -e "\nStoring old index.ts file\n"
  cp $OLD_INDEX_FILE "$PWD/$TEMP_FOLDER/index.ts"
fi

# # Run API-client generator
echo -e "\nGenerating API Client"
cp $SCRIPTS_PATH/templates/openapitools.json $PWD/openapitools.json
npx openapi-generator-cli version
npx openapi-generator-cli generate \
  --reserved-words-mappings case=case \
  -g typescript-angular \
  -i $LIB_PATH/swagger.json \
  -o $LIB_PATH/src \
  --additional-properties=providedIn=any \
  --additional-properties=ngVersion="$ANGULAR_VERSION"

# Cleanup
echo -e "\nRemoving autogenerated files"
rm openapitools.json
(cd $LIB_PATH/src && rm -r .openapi-generator .gitignore .openapi-generator-ignore git_push.sh)

# Restore old index.ts file if existed
if [[ -f "$PWD/$TEMP_FOLDER/index.ts" ]]; then
  echo -e "Restoring old index.ts file"
  cp "$PWD/$TEMP_FOLDER/index.ts" $OLD_INDEX_FILE
fi
rm -r "$TEMP_FOLDER"

# Discard files that were only affected by line endings
git add . > /dev/null 2>&1
git restore --staged . > /dev/null 2>&1

echo -e "\n\U1F389\U1F389\U1F389 \033[0;32mSuccess!! The new library has been created!\033[0m \U1F389\U1F389\U1F389"