import { Stream } from 'stream';
import { writeFileSync, existsSync } from 'fs';

import { Axios, AxiosInstance, AxiosRequestConfig, FormData } from '../common';

export class BaseRequest {
  private axios: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.axios = Axios.create(config || {});
  }

  public async getData(url: string, config?: AxiosRequestConfig, key = 'data') {
    const response = await this.get(url, config);
    return response?.data && response.data[key] ? response.data[key] : null;
  }

  public async postData(url: string, config?: AxiosRequestConfig, key = 'data') {
    const response = await this.post(url, config);
    return response?.data && response.data[key] ? response.data[key] : null;
  }

  public async putData(url: string, config?: AxiosRequestConfig, key = 'data') {
    const response = await this.put(url, config);
    return response?.data && response.data[key] ? response.data[key] : null;
  }

  public async postFormData(url: string, data: Record<string, any>, config: AxiosRequestConfig) {
    const form = new FormData();

    const configs = Object.assign({ headers: form.getHeaders() }, config);

    Object.keys(data).forEach((key) => form.append(key, data[key]));

    const response = await this.axios.post(url, form, configs);
    return response;
  }

  public async buffer(url: string, config?: AxiosRequestConfig) {
    const response = await this.get(
      url,
      Object.assign({ responseType: 'arraybuffer' }, config),
    );

    if (!response) return null;
    return response.data as Buffer;
  }

  public async stream(url: string, config?: AxiosRequestConfig) {
    const response = await this.get(
      url,
      Object.assign({ responseType: 'stream' }, config),
    );

    if (!response) return null;
    return response.data as Stream;
  }

  public async base64(url: string, config?: AxiosRequestConfig) {
    const data = await this.buffer(url, config);

    if (!data) return null;
    return data.toString('base64');
  }

  public async download(url: string, path: string, config?: AxiosRequestConfig) {
    if (!existsSync(path)) {
      throw new Error(`The ${path} does not exist`);
    }

    const buffer = await this.buffer(url, config);

    if (!buffer) return null;

    writeFileSync(path, buffer, 'binary');

    return path;
  }

  /** Method GET */
  public async get(url: string, config?: AxiosRequestConfig) {
    const result = await this.axios.get(url, config);
    return result;
  }

  /** Method POST */
  public async post(url: string, config?: AxiosRequestConfig) {
    const result = await this.axios.post(url, config.data, config);
    return result;
  }

  /** Method PUT */
  public async put(url: string, config?: AxiosRequestConfig) {
    const result = await this.axios.put(url, config.data, config);
    return result;
  }

  /** Method Delete */
  public async delete(url: string, config?: AxiosRequestConfig) {
    const result = await this.axios.delete(url, config);
    return result;
  }

  /** Method Options */
  public async options(url: string, config?: AxiosRequestConfig) {
    const result = await this.axios.options(url, config);
    return result;
  }
}
