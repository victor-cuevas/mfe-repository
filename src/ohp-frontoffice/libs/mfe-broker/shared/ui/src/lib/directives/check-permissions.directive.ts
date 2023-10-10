import { Directive, Inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { CheckPermissionsServiceInterface, PERMISSIONS, RequiredInput } from '@close-front-office/mfe-broker/core';
import { PortalPermissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { PanelPermissionType } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

/**
 * Structural directive that applies to an element and checks if it has the required view-feature
 * permission combination to show it or remove it from the DOM.
 *
 * If we want to check multiple features with a specific section / mbpPermission, we can pass in the second argument
 * as an array of strings. In case of the latter ALL features must be marked as true in the permissions service.
 *
 * @param cfoPermission The section permissions. (mandatory)
 * @param cfoPermissionFeature The specific feature permission we check for. Can either be a string for a single feature to check, or an array of strings when
 * we want to check multiple features. (mandatory)
 *
 */
@Directive({
  selector: '[cfoPermissions]',
})
export class CheckPermissionsDirective implements OnInit {
  @Input() @RequiredInput cfoPermissions!: string;
  @Input() @RequiredInput cfoPermissionsFeatures!: string[];
  @Input() cfoPermissionsNeededPermission?: PortalPermissionType | PanelPermissionType;
  @Input() cfoPermissionsElse?: TemplateRef<unknown>;

  constructor(
    @Inject(PERMISSIONS) private permissionsService: CheckPermissionsServiceInterface,
    private templateRef: TemplateRef<never>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnInit() {
    if (
      this.permissionsService.checkPermissions({
        section: this.cfoPermissions,
        features: this.cfoPermissionsFeatures,
        neededPermission: this.cfoPermissionsNeededPermission,
      })
    ) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.cfoPermissionsElse) {
      this.viewContainer.createEmbeddedView(this.cfoPermissionsElse);
    } else {
      this.viewContainer.clear();
    }
  }
}
