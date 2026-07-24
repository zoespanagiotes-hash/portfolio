import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';

import { environment } from '../environments/environment.dev';

export interface Asset {
  id: number;
  key: string;
  bucket: string;
  storage_path: string;
  asset_type: 'image' | 'document';
  alt_text: string | null;
  title: string | null;
  is_public: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private readonly supabase: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey,
  );

  async getAsset(assetKey: string): Promise<Asset> {
    const { data, error } = await this.supabase
      .from('assets')
      .select('*')
      .eq('key', assetKey)
      .eq('is_public', true)
      .single();

    if (error) {
      throw new Error(`Asset could not be loaded: ${error.message}`);
    }

    return data as Asset;
  }

  getPublicUrl(asset: Asset): string {
    const { data } = this.supabase.storage
      .from(asset.bucket)
      .getPublicUrl(asset.storage_path);

    return data.publicUrl;
  }

  async getAssetUrl(assetKey: string): Promise<string> {
    const asset = await this.getAsset(assetKey);

    return this.getPublicUrl(asset);
  }

  async getPrivateAssetUrl(
    assetKey: string,
    expiresInSeconds = 60,
  ): Promise<string> {
    const asset = await this.getAsset(assetKey);

    const { data, error } = await this.supabase.storage
      .from(asset.bucket)
      .createSignedUrl(asset.storage_path, expiresInSeconds);

    if (error) {
      throw new Error(`Signed URL could not be created: ${error.message}`);
    }

    return data.signedUrl;
  }

   async testConnection(): Promise<boolean> {
    const { error } = await this.supabase
      .from('public.assets')
      .select('id')
      .limit(10);

    if (error) {
      throw new Error(
        `Supabase connection failed: ${error.message}`,
      );
    }

    return true;
  }

  async getOptimizedImageUrl(
    assetKey: string,
    width: number,
    height?: number,
  ): Promise<string> {
    const asset = await this.getAsset(assetKey);

    if (asset.asset_type !== 'image') {
      throw new Error('The requested asset is not an image.');
    }

    const { data } = this.supabase.storage
      .from(asset.bucket)
      .getPublicUrl(asset.storage_path, {
        transform: {
          width,
          height,
          resize: 'cover',
          quality: 80,
        },
      });

    return data.publicUrl;
  }
}