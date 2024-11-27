/**
 * Contains the class definition for HttpService class, and service routes.
 * HttpService provides easy extension for additional routes.
 * @author Christopher Curtis
 */
import { Message, ServiceCategory } from "../types";
import apiClient from "./api-client";

/**
 * Defines a resuable HTTP-Service class.
 * Contains a post method.
 */
class HttpService {
    endpoint: string;

    /**
     * Constructs an HTTP service object. Base URL is defined the api-client file.
     * Directs requests to provided endpoint of the base url.
     * @param endpoint the target route to post to
     */
    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    /**
     * Performs a post request and loads in the provided message histroy
     * @param messages message history to 
     * @returns response object from endpoint, and abort logic
     */
    get(info: string) {
        const controller = new AbortController();
        const request = apiClient.get(this.endpoint + "/" + info, { signal: controller.signal });
        return { request, cancel: () => controller.abort() };
    }

    /**
     * Performs a post request and loads in the provided message histroy
     * @param messages message history to 
     * @returns response object from endpoint, and abort logic
     */
    getImage(info: string) {
        const controller = new AbortController();
        const request = apiClient.get(this.endpoint + "/" + info, { signal: controller.signal, responseType: 'blob' });
        return { request, cancel: () => controller.abort() };
    }

    post(data: any) {
        const controller = new AbortController();
        const request = apiClient.post(this.endpoint, { params: data, signal: controller.signal });
        return { request, cancel: () => controller.abort() };
    }

    /**
     * Performs a post request and loads in the provided message histroy
     * @param messages message history to 
     * @returns response object from endpoint, and abort logic
     */
    postMessages(messages: { role: string; content: string; }[]) {
        const controller = new AbortController();
        const request = apiClient.post(this.endpoint, { params: { messages: messages }, signal: controller.signal });
        return { request, cancel: () => controller.abort() };
    }
}



const createFileService = () => {
    // Handles audio or text files, turns them into texts
    // Input: {"type":text or audio, "content":file}
    // Output: {"content":text}
    return new HttpService("/file");
}

const createAudioService = () => {
    // Handles audio URL, turns into texts
    // Input {"content":audio}
    // Output: {"content":text}
    return new HttpService("/audio");
}

const createImageService = () => {
    return new HttpService("/image");
}

const createSampleImageService = () => {
    return new HttpService("/sample-image");
}

const createService = (type: ServiceCategory) => {
    return new HttpService("/" + type);
}

export {createImageService, createService, createFileService, createSampleImageService, createAudioService };
