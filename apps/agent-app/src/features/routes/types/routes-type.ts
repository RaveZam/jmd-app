export type Route = {
  id: string;
  name: string;
};

export type StoreCard = {
  name: string;
  areaTag: string;
  address: string;
  status: string;
  contactName: string;
  contactNumber: string;
  onPress?: () => void;
};

export type TenderedCard = {
  routeName: string;
  areaTag: string;
  address: string;
  contactName: string;
  contactNumber: string;
};
