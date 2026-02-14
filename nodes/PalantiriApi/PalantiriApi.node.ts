import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class PalantiriApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Palantiri API',
		name: 'palantiriApi',
		icon: { light: 'file:palantiriApiIcon.svg', dark: 'file:palantiriApiIcon.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] }}',
		description: 'Enviar mensagens e consultar palantiriAPI (WhatsApp)',
		defaults: { name: 'Palantiri API' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'palantiriApiApi', required: true }],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Instance ID',
				name: 'instanceId',
				type: 'string',
				default: '',
				placeholder: 'default',
				description: 'ID da instância WhatsApp na palantiriAPI',
				required: true,
			},
			{
				displayName: 'Operação',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Enviar Documento', value: 'sendDocument' },
					{ name: 'Enviar Imagem', value: 'sendImage' },
					{ name: 'Enviar Texto', value: 'sendText' },
					{ name: 'Listar Chats', value: 'listChats' },
					{ name: 'Listar Mensagens', value: 'listMessages' },
					{ name: 'Status', value: 'status' },
				],
				default: 'sendText',
				description: 'Ação a executar',
			},
			// --- sendText / sendImage / sendDocument
			{
				displayName: 'Para (JID Ou Número)',
				name: 'to',
				type: 'string',
				default: '',
				placeholder: '5511999999999 ou 120363xxx@g.us',
				description: 'Número com DDI (ex.: 5511999999999) ou JID de grupo (ex.: 120363xxx@g.us)',
				displayOptions: { show: { operation: ['sendText', 'sendImage', 'sendDocument'] } },
				required: true,
			},
			{
				displayName: 'Texto',
				name: 'text',
				type: 'string',
				default: '',
				description: 'Mensagem de texto (sendText) ou legenda (sendImage/sendDocument)',
				displayOptions: { show: { operation: ['sendText', 'sendImage', 'sendDocument'] } },
				required: true,
			},
			{
				displayName: 'Conteúdo Base64',
				name: 'contentBase64',
				type: 'string',
				default: '',
				description: 'Arquivo em Base64 (obrigatório para sendImage e sendDocument)',
				displayOptions: { show: { operation: ['sendImage', 'sendDocument'] } },
				required: true,
			},
			{
				displayName: 'Mimetype',
				name: 'mimetype',
				type: 'string',
				default: 'image/png',
				description: 'Ex.: image/png, image/jpeg, application/pdf',
				displayOptions: { show: { operation: ['sendImage', 'sendDocument'] } },
			},
			{
				displayName: 'Nome Do Arquivo',
				name: 'fileName',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['sendDocument'] } },
			},
			// --- listMessages
			{
				displayName: 'Chat JID',
				name: 'chat',
				type: 'string',
				default: '',
				placeholder: '5511999999999@s.whatsapp.net ou 120363xxx@g.us',
				description: 'JID do chat para listar mensagens',
				displayOptions: { show: { operation: ['listMessages'] } },
				required: true,
			},
			{
				displayName: 'Limite',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
				displayOptions: { show: { operation: ['listChats', 'listMessages'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await this.getCredentials('palantiriApiApi') as { baseUrl: string; apiKey: string };
		const baseUrl = (credentials.baseUrl || '').replace(/\/$/, '');
		const apiKey = credentials.apiKey || '';
		const instanceId = this.getNodeParameter('instanceId', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'X-API-Key': apiKey,
		};

		const items = this.getInputData();
		const results: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				let response: unknown;
				const id = instanceId || 'default';

				switch (operation) {
					case 'status': {
						response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/instances/${id}/status`,
							headers,
							json: true,
						});
						break;
					}
					case 'sendText': {
						const to = this.getNodeParameter('to', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/instances/${id}/send-text`,
							headers,
							body: { to, text },
							json: true,
						});
						break;
					}
					case 'sendImage': {
						const to = this.getNodeParameter('to', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const contentBase64 = this.getNodeParameter('contentBase64', i) as string;
						const mimetype = (this.getNodeParameter('mimetype', i) as string) || 'image/png';
						response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/instances/${id}/send-image`,
							headers,
							body: { to, text, content_base64: contentBase64, mimetype },
							json: true,
						});
						break;
					}
					case 'sendDocument': {
						const to = this.getNodeParameter('to', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const contentBase64 = this.getNodeParameter('contentBase64', i) as string;
						const mimetype = (this.getNodeParameter('mimetype', i) as string) || 'application/octet-stream';
						const fileName = (this.getNodeParameter('fileName', i) as string) || '';
						response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/instances/${id}/send-document`,
							headers,
							body: { to, text, content_base64: contentBase64, mimetype, file_name: fileName },
							json: true,
						});
						break;
					}
					case 'listChats': {
						const limit = (this.getNodeParameter('limit', i) as number) || 50;
						response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/instances/${id}/chats`,
							headers,
							qs: { limit },
							json: true,
						});
						break;
					}
					case 'listMessages': {
						const chat = this.getNodeParameter('chat', i) as string;
						const limit = (this.getNodeParameter('limit', i) as number) || 50;
						response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/instances/${id}/messages`,
							headers,
							qs: { chat, limit },
							json: true,
						});
						break;
					}
					default:
						response = { error: `Operação não implementada: ${operation}` };
				}

				results.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error: unknown) {
				const err = error as { message?: string; response?: { body?: IDataObject } };
				if (this.continueOnFail()) {
					results.push({
						json: { error: err.message || String(error), details: err.response?.body } as IDataObject,
						pairedItem: { item: i },
					});
				} else {
					throw error;
				}
			}
		}

		return [results];
	}
}

// n8n carrega o nó via require(); default export garante compatibilidade
export default PalantiriApi;
