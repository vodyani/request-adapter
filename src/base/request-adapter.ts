import { AxiosRequestConfig } from 'axios';
import { ClientAdapter } from '@vodyani/core';

import { BaseRequest } from './request';

export class RequestAdapter implements ClientAdapter {
  public instance: BaseRequest;

  constructor(options: AxiosRequestConfig) {
    this.instance = new BaseRequest(options);
  }

  public close() {
    this.instance = null;
  }
}
