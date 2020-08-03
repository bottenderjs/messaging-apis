import AxiosError from 'axios-error';
import get from 'lodash/get';
import { AxiosError as BaseAxiosError } from 'axios';

import FacebookBaseClient from './FacebookBaseClient';
import * as Types from './FacebookTypes';

function handleError(
  err: BaseAxiosError<{
    error: {
      code: number;
      type: string;
      message: string;
    };
  }>
): never {
  if (err.response && err.response.data) {
    const error = get(err, 'response.data.error');
    if (error) {
      const msg = `Facebook API - ${error.code} ${error.type} ${error.message}`;
      throw new AxiosError(msg, err);
    }
  }
  throw new AxiosError(err.message, err);
}

export default class FacebookUserClient extends FacebookBaseClient {
  /**
   * Get fields and edges on the User of the access token.
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/user/#Reading
   */
  getUserInfo<T extends Types.FacebookUserField = 'id' | 'name'>({
    fields = ['id' as T, 'name' as T],
  }: { fields?: T[] } = {}): Promise<
    Pick<
      Types.FacebookUser,
      Types.CamelCaseUnion<Types.FacebookUserKeyMap, typeof fields[number]>
    >
  > {
    return this.axios
      .get<
        Pick<
          Types.FacebookUser,
          Types.CamelCaseUnion<Types.FacebookUserKeyMap, typeof fields[number]>
        >
      >('/me', {
        params: {
          access_token: this.accessToken,
          fields: fields.join(','),
        },
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Returns a list of granted and declined permissions.
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/user/permissions/#Reading
   */
  getPermissions<
    T extends Types.FacebookUserPermissionField = 'permission' | 'status'
  >({
    permission,
    status,
    fields = ['permission' as T, 'status' as T],
  }: {
    permission?: string;
    status?: Types.FacebookUserPermission['status'];
    fields?: T[];
  } = {}): Promise<
    Types.PagingData<Pick<Types.FacebookUserPermission, typeof fields[number]>>
  > {
    return this.axios
      .get<
        Types.PagingData<
          Pick<Types.FacebookUserPermission, typeof fields[number]>
        >
      >('/me/permissions', {
        params: {
          access_token: this.accessToken,
          permission,
          status,
          fields: fields.join(','),
        },
      })
      .then((res) => res.data, handleError);
  }

  /**
   *
   * @param param0
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/user/accounts/#Reading
   */
  getUserAccounts<
    T extends Types.FacebookUserAccountField =
      | 'id'
      | 'name'
      | 'category'
      | 'category_list'
      | 'access_token'
      | 'tasks'
  >({
    isPlace,
    isPromotable,
    fields = [
      'id' as T,
      'name' as T,
      'category' as T,
      'category_list' as T,
      'access_token' as T,
      'task' as T,
    ],
    after,
  }: {
    isPlace?: boolean;
    isPromotable?: boolean;
    fields?: T[];
    after?: string;
  } = {}): Promise<Types.PagingData<Types.FacebookUserAccount>> {
    return this.axios
      .get<Types.PagingData<Types.FacebookUserAccount>>('/me/accounts', {
        params: {
          access_token: this.accessToken,
          is_place: isPlace,
          is_promotable: isPromotable,
          after,
          fields: fields.join(','),
        },
      })
      .then((res) => res.data, handleError);
  }

  /**
   *
   * @param pageId
   * @param param1
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/page/
   */
  getPage<T extends Types.FacebookPageField = 'id' | 'name'>(
    pageId: string,
    { fields = ['id' as T, 'name' as T] }: { fields?: T[] } = {}
  ): Promise<
    Pick<
      Types.FacebookPage,
      Types.CamelCaseUnion<Types.FacebookPageKeyMap, typeof fields[number]>
    >
  > {
    return this.axios
      .get<
        Pick<
          Types.FacebookPage,
          Types.CamelCaseUnion<Types.FacebookPageKeyMap, typeof fields[number]>
        >
      >(`/${pageId}`, {
        params: {
          access_token: this.accessToken,
          fields: fields.join(','),
        },
      })
      .then((res) => res.data, handleError);
  }
}
