export type ResourceDocumentId = string | number;

export interface ResourceDocument extends Record<string, any> {
  id: ResourceDocumentId;
}
