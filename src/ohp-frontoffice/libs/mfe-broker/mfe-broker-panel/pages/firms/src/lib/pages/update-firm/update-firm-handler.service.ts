import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Club,
  FirmAddressModel,
  FirmDetailsModel,
  RegisterNewFirmRequest,
  SubmissionRoutesObject,
  SubmissionRouteType,
  UpdateFirmAddressRequest,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { FeTradingAddress } from '@close-front-office/mfe-broker/mfe-broker-panel/core';

@Injectable()
export class UpdateFirmHandlerService {
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  constructor(private fb: FormBuilder) {
    this.createForm();
    this.createAssociationForm();
  }

  createForm() {
    return this.fb.group({
      addressType: 'UK',
      firmType: [SubmissionRouteType.DirectlyAuthorized, Validators.required],
      firmName: [null, Validators.required],
      fcaReference: [null, Validators.compose([Validators.required, Validators.min(1), Validators.max(9999999)])],
      principalFcaReference: [null],
      reference: [null],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      telephone: [null],
      website: [null],
      complaintsWebpage: [null, Validators.compose([Validators.required, Validators.pattern(this.reg)])],
      isActive: [false],
      isInReview: [false],
      sendCaseToEmail: false, //In the model
      tradingName: [null],
      businessDevelopmentManager: [null],
      isTradingAddress: [false],
    });
  }

  createAssociationForm() {
    return this.fb.group({
      clubs: [[]],
      submissionRoute: [null],
    });
  }

  mapToForm(data: FirmDetailsModel, dataAddress: FirmAddressModel) {
    return {
      firmType: data.firmType ? data.firmType : null,
      firmName: data.firmName ? data.firmName : null,
      fcaReference: data.fcaReference ? data.fcaReference : null,
      principalFcaReference: data.principalFcaReference ? data.principalFcaReference : null,
      reference: data.reference ? data.reference : null,
      email: data.email ? data.email : null,
      telephone: data.telephone?.mobile ? data.telephone.mobile : null,
      website: data.website ? data.website : null,
      complaintsWebpage: data.complaintsWebpage ? data.complaintsWebpage : null,
      isActive: data.isActive ? data.isActive : false,
      isInReview: data.isInReview ? data.isInReview : false,
      sendCaseToEmail: false, //In the model is mandatory
      tradingName: dataAddress.tradingName ? dataAddress.tradingName : null,
      businessDevelopmentManager: dataAddress.businessDevelopmentManager ? dataAddress.businessDevelopmentManager : null,
      isTradingAddress: dataAddress.addressType === 'Firm Address' ? false : true,
    };
  }

  mapToDTO(rawValueForm: any, rawValueTradingAddress: any): RegisterNewFirmRequest {
    const tradingAddresses: any[] = [];
    rawValueTradingAddress?.forEach((tradingAddress: any) => {
      const tradingAddressObj = {
        postcode: tradingAddress.address.zipCode,
        city: tradingAddress.address.city,
        country: tradingAddress.address.country,
        lineOne: tradingAddress.address.addressLine1,
        lineTwo: tradingAddress.address.addressLine2,
        lineThree: tradingAddress.address.addressLine3,
        lineFour: tradingAddress.address.addressLine4,
        lineFive: tradingAddress.address.addressLine5,
        tradingName: tradingAddress.tradingName,
        businessDevelopmentManager: tradingAddress.businessDevelopmentManager,
        isTradingAddress: true,
      };
      tradingAddresses.push(tradingAddressObj);
    });
    return {
      firmType: rawValueForm.firmType,
      firmName: rawValueForm.firmName,
      fcaReference: rawValueForm.fcaReference,
      principalFcaReference: rawValueForm.principalFcaReference,
      reference: rawValueForm.reference,
      email: rawValueForm.email,
      telephone: rawValueForm.telephone
        ? {
            mobile: rawValueForm.telephone,
          }
        : null, //workaround to ADS validation
      website: rawValueForm.website === '' ? null : rawValueForm.website, //workaround to ADS validation
      complaintsWebpage: rawValueForm.complaintsWebpage,
      isActive: rawValueForm.isActive,
      isInReview: rawValueForm.isInReview,
      sendCaseToEmail: true,
      firmAddress: {
        postcode: rawValueForm.address.zipCode,
        city: rawValueForm.address.city,
        country: rawValueForm.address.country,
        lineOne: rawValueForm.address.addressLine1,
        lineTwo: rawValueForm.address.addressLine2,
        lineThree: rawValueForm.address.addressLine3,
        lineFour: rawValueForm.address.addressLine4,
        lineFive: rawValueForm.address.addressLine5,
        tradingName: rawValueForm.tradingName,
        businessDevelopmentManager: rawValueForm.businessDevelopmentManager,
        isTradingAddress: rawValueForm.isTradingAddress,
      },
      tradingAddresses: tradingAddresses,
    };
  }

  mapToDTOFirm(formValue: any, firmData: any) {
    return {
      firmType: formValue.firmType,
      firmName: formValue.firmName,
      fcaReference: formValue.fcaReference,
      principalFcaReference: formValue.principalFcaReference,
      reference: formValue.reference,
      email: formValue.email,
      telephone: formValue.telephone
        ? {
            mobile: formValue.telephone,
          }
        : null, //workaround to ADS validation
      website: formValue.website === '' ? null : formValue.website, //workaround to ADS validation
      complaintsWebpage: formValue.complaintsWebpage,
      isActive: formValue.isActive,
      isInReview: formValue.isInReview,
      sendCaseToEmail: false,
      version: firmData.version,
    };
  }

  mapToDTOAddress(formValue: FeTradingAddress, version: number): UpdateFirmAddressRequest {
    return {
      postcode: formValue?.postcode,
      city: formValue?.city,
      country: formValue?.country,
      lineOne: formValue?.lineOne,
      lineTwo: formValue?.lineTwo,
      lineThree: formValue?.lineThree,
      lineFour: formValue?.lineFour,
      lineFive: formValue?.lineFive,
      tradingName: formValue.tradingName,
      businessDevelopmentManager: formValue.businessDevelopmentManager,
      version,
    };
  }

  mapToDTOAssociations(submissionRouteId: string, clubs: Club[], submissionRoutesObject: SubmissionRoutesObject) {
    return {
      networks: this.mapSubmissionRouteToId(submissionRouteId, submissionRoutesObject, SubmissionRouteType.Network),
      directlyAuthorized: this.mapSubmissionRouteToId(submissionRouteId, submissionRoutesObject, SubmissionRouteType.DirectlyAuthorized),
      clubs: this.mapClubsToId(clubs),
    };
  }

  mapToDTOAssociationsJustClub(clubs: Club[]) {
    return {
      clubs: this.mapClubsToId(clubs),
    };
  }

  private mapSubmissionRouteToId(
    submissionRouteId: string,
    submissionRoutesObject: SubmissionRoutesObject,
    submissionRouteType: SubmissionRouteType,
  ): string[] {
    const submissionRoute = submissionRoutesObject[submissionRouteId];

    return submissionRoute?.submissionRouteType === submissionRouteType ? [submissionRoute.id] : [];
  }

  private mapClubsToId(clubs: Club[]): string[] {
    return clubs.map(el => el.value);
  }
}
