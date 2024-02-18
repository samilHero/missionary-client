import axios, { AxiosInstance } from 'axios'

const createApiInstance = (apiUrl: string, requestHeaders?: object): AxiosInstance => {
    let headers = {
        'Content-Type': 'application/json-patch+json',
    }

    if (requestHeaders) {
        headers = { ...headers, ...requestHeaders }
    }
    return axios.create({
        baseURL: apiUrl,
        headers,
    })
}

export default createApiInstance(process.env.NEXT_PUBLIC_PROXY_API_URL)
