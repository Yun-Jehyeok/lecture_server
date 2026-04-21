const LOCAL_SOCIAL_CALLBACK_URL = "http://localhost:3000/auth/callback";
const PRODUCTION_SOCIAL_CALLBACK_URL =
    "https://www.cobbak-lecture.com/auth/callback";

type PackedSocialState = {
    callbackUrl: string;
    clientState?: string;
};

function normalizeOriginHeader(value?: string | string[]) {
    if (!value) {
        return undefined;
    }

    return Array.isArray(value) ? value[0] : value;
}

function resolveCallbackUrl(
    requestOrigin?: string | string[],
    requestReferer?: string | string[],
) {
    const originOrReferer =
        normalizeOriginHeader(requestOrigin) ??
        normalizeOriginHeader(requestReferer);

    if (!originOrReferer) {
        return PRODUCTION_SOCIAL_CALLBACK_URL;
    }

    try {
        const sourceUrl = new URL(originOrReferer);

        if (
            sourceUrl.protocol === "http:" &&
            sourceUrl.hostname === "localhost" &&
            sourceUrl.port === "3000"
        ) {
            return LOCAL_SOCIAL_CALLBACK_URL;
        }
    } catch {
        return PRODUCTION_SOCIAL_CALLBACK_URL;
    }

    return PRODUCTION_SOCIAL_CALLBACK_URL;
}

export function createPackedSocialState(params: {
    clientState?: string;
    requestOrigin?: string | string[];
    requestReferer?: string | string[];
}) {
    const payload: PackedSocialState = {
        callbackUrl: resolveCallbackUrl(
            params.requestOrigin,
            params.requestReferer,
        ),
    };

    if (params.clientState) {
        payload.clientState = params.clientState;
    }

    return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function parsePackedSocialState(state?: string) {
    if (!state) {
        return {
            callbackUrl: PRODUCTION_SOCIAL_CALLBACK_URL,
            clientState: undefined,
        };
    }

    try {
        const parsed = JSON.parse(
            Buffer.from(state, "base64url").toString("utf8"),
        ) as Partial<PackedSocialState>;

        return {
            callbackUrl:
                parsed.callbackUrl === LOCAL_SOCIAL_CALLBACK_URL
                    ? LOCAL_SOCIAL_CALLBACK_URL
                    : PRODUCTION_SOCIAL_CALLBACK_URL,
            clientState:
                typeof parsed.clientState === "string"
                    ? parsed.clientState
                    : undefined,
        };
    } catch {
        return {
            callbackUrl: PRODUCTION_SOCIAL_CALLBACK_URL,
            clientState: state,
        };
    }
}
