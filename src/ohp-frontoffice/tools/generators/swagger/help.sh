################################################################################
# Help                                                                         #
# Output of the --help command for the swagger generator script                #
################################################################################

help () {
  echo "GENERATE-API"
  echo "------------"
  echo "This script generates the API Client in an existing api library the"
  echo "monorepo or creates a brand new library and generates de API Client."
  echo "API libraries are always generated under the following folder structure:"
  echo "libs/<name>/api"
  echo
  echo "The script generates a README file with further information about the library"
  echo
  echo "This is a list of the necessary parameters for the script to run"
  echo "Parameters:"
  echo
  echo "System:"
  echo "-h, --help            Displays the help content"
  echo "-v, --version         Displays the version number"
  echo
  echo "Mandatory:"
  echo "-n, --name            Name of the mfe where the api library will be created"
  echo
  echo "Optional:"
  echo "-c, --client          Client folder in the configuration folder to read the"
  echo "                      API URL. Defaults to \"team\""
  echo "-s, --stage           Stage folder in the configuration folder to read the"
  echo "                      API URL. Defaults to \"dev\""
  echo "-u, --swaggerUrl      Url pointing to the swagger file. If this parameter is"
  echo "                      provided, client and stage will be ignored."
  echo "-a, --apiLib          Name of the API library that will be generated. Defaults"
  echo "                      to \"api\""
  echo

  exit 0
}