import { MutationDataDto } from './mutation-data.model';
import { MutationInitialDataDto } from './mutation-Initialdata.model';

export class ManageMutationResponse{

    ManageMutationInitialData !: MutationInitialDataDto
    ManageMutationData !: MutationDataDto
}