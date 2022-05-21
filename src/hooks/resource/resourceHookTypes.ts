import { ResourceDocument, ResourceService } from "../../services";

export interface UseCRUD<T extends ResourceDocument> {
  service: ResourceService<T>;
  id?: ResourceDocument["id"];
}
