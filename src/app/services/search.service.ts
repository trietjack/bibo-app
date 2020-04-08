import { Injectable } from '@angular/core';
import { algoliaConfig } from '../../environments/environment';
import algoliasearch from 'algoliasearch';
import { List } from 'immutable';
import { fromJS, VideoJSON, SearchVideoJSON } from './video/state/video.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private client = algoliasearch(
    algoliaConfig.app_id,
    algoliaConfig.search_key
  );
  private index = this.client.initIndex('bibo_search');

  constructor() {}

  async search(text: string) {
    const res = await this.index.search(text);

    return List(
      res.hits.map(hit =>
        fromJS((hit as unknown) as Omit<SearchVideoJSON, 'objectID'>)
      )
    );
  }
}