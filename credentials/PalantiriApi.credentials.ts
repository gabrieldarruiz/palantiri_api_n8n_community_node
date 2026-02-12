import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PalantiriApiApi implements ICredentialType {
	name = 'palantiriApiApi';

	displayName = 'Palantiri API';

	documentationUrl = 'https://github.com/gabrieldarruiz/palantiri_api_n8n_community_node';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.example.com',
			placeholder: 'https://sua-api.com',
			description: 'URL base da palantiriAPI (ex.: https://n8n.astrasolution.com.br/palantiri)',
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
