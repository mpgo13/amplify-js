import Signer from '../src/Signer';

jest.mock('@aws-sdk/util-hex-encoding', () => ({
	...jest.requireActual('@aws-sdk/util-hex-encoding'),
	toHex: () => {
		return 'encrypt';
	},
}));

describe('Signer test', () => {
	describe('sign test', () => {
		test('happy case', async () => {
			const url = 'https://host/some/path';

			const request = {
				url,
				headers: {},
			};
			const access_info = {
				session_token: 'session_token',
			};

			const spyon = jest
				.spyOn(Date.prototype, 'toISOString')
				.mockReturnValueOnce('0');

			const res = {
				headers: {
					Authorization:
						'AWS4-HMAC-SHA256 Credential=undefined/0/aregion/aservice/aws4_request, SignedHeaders=host;x-amz-date;x-amz-security-token, Signature=encrypt',
					'X-Amz-Security-Token': 'session_token',
					host: 'host',
					'x-amz-date': '0',
				},
				url: url,
			};
			expect(
				await Signer.sign(request, access_info, {
					service: 'aservice',
					region: 'aregion',
				})
			).toEqual(res);

			spyon.mockClear();
		});

		test('happy case signUrl', async () => {
			const url = 'https://example.com:1234/some/path';

			const access_info = {
				session_token: 'session_token',
			};

			const spyon = jest
				.spyOn(Date.prototype, 'toISOString')
				.mockReturnValueOnce('0');

			const expectedUrl =
				'https://example.com:1234/some/path?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=%2F0%2Faregion%2Faservice%2Faws4_request&X-Amz-Date=0&X-Amz-Security-Token=session_token&X-Amz-SignedHeaders=host&X-Amz-Signature=encrypt';

			const signedUrl = await Signer.signUrl(url, access_info, {
				service: 'aservice',
				region: 'aregion',
			});

			expect(signedUrl).toEqual(expectedUrl);

			spyon.mockClear();
		});
	});
});
