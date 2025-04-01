const allowedOrigins = [
	"https://cp20.dev",
	"https://2025.cp20.dev",
	"https://trap.jp",
	// Zenn OG Image
	"https://res.cloudinary.com/zenn",
	"https://static.sizu.me",
	"https://assets.st-note.com",
	"https://qiita-user-contents.imgix.net",
];

export default {
	async fetch(request) {
		const url = new URL(request.url);

		const options: RequestInit<CfProperties> = {
			cf: {
				image: {
					fit: "scale-down",
					width: url.searchParams.has("width")
						? Number.parseInt(url.searchParams.get("width")!)
						: undefined,
					height: url.searchParams.has("height")
						? Number.parseInt(url.searchParams.get("height")!)
						: undefined,
					quality: url.searchParams.has("quality")
						? Number.parseInt(url.searchParams.get("quality")!)
						: undefined,
					format: /image\/webp/.test(request.headers.get("Accept") ?? "")
						? "webp"
						: "jpeg",
				},
			},
		};

		const imageURL = url.searchParams.get("image");
		if (!imageURL) {
			return new Response('Missing "image" value', { status: 400 });
		}

		try {
			const { href } = new URL(imageURL);
			if (allowedOrigins.every((origin) => !href.startsWith(origin))) {
				return new Response('Invalid "image" value', { status: 400 });
			}
		} catch (err) {
			return new Response('Invalid "image" value', { status: 400 });
		}

		// Build a request that passes through request headers
		const imageRequest = new Request(imageURL, {
			headers: request.headers,
		});

		return fetch(imageRequest, options);
	},
} satisfies ExportedHandler<Env>;
