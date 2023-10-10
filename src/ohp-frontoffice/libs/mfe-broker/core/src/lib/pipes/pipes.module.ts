import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrependEnvPathPipe } from './prepend-env-path.pipe';
import { InitialPipe } from './initial.pipe';
import { LeftPad } from './caseId.pipe';
import { UserRolePipe } from './user-role.pipe';
import { UserPermissionPipe } from './user-permission.pipe';
import { SubmissionRoutePipe } from './submission-route.pipe';

@NgModule({
  imports: [CommonModule],
  providers: [],
  exports: [PrependEnvPathPipe, InitialPipe, LeftPad, UserRolePipe, UserPermissionPipe, SubmissionRoutePipe],
  declarations: [PrependEnvPathPipe, InitialPipe, LeftPad, UserRolePipe, UserPermissionPipe, SubmissionRoutePipe],
})
export class PipesModule {}
