export type Route = {
  id: string;
  name: string;
};

export type DraftStore = {
  id: string;
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
};

export type DraftProvince = {
  id: string;
  name: string;
  stores: DraftStore[];
};

export type CreateRouteDraft = {
  name: string;
  provinces: DraftProvince[];
};
