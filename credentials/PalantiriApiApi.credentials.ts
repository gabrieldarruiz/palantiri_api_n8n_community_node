import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PalantiriApiApi implements ICredentialType {
	name = 'palantiriApiApi';

	displayName = 'Palantiri API';

	documentationUrl = 'https://github.com/gabrieldarruiz/palantiri_api_n8n_community_node';

	icon = 'file:palantiriApi.svg' as const;

	test = {
		request: {
			method: 'GET' as const,
			url: '={{ $credentials.baseUrl }}/instances',
			headers: {
				'X-API-Key': '={{ $credentials.apiKey }}',
			},
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://palantiri-api.astrasolution.com.br',
			placeholder: 'https://palantiri-api.astrasolution.com.br',
			description: 'URL base da palantiriAPI',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API Key da instância (ou Bearer token JWT). Enviado como X-API-Key ou Authorization.',
			required: true,
		},
	];
}

export default PalantiriApiApi;
