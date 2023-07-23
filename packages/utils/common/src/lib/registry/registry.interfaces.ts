export interface RegistryService {
  id: string;
  type: 'DecentrlRegistry';
  serviceEndpoint: RegistryServiceEndpoint;
}

export interface RegistryServiceEndpoint {
  uri: string;
  routingKeys: string[];
}
