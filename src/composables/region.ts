import { useState } from 'nuxt/app';
import { STATE_KEYS } from '~/utils/consts';
import { getGeoIp } from '~/utils/helpers';

/**
 * Composable to access and manage the user's region
 * @returns An object with functions to get and set the user's region
 */
export const useRegion = () => {
  // Initialize the region state with null (will be fetched when needed)
  const region = useState<string | null>(STATE_KEYS.REGION, () => null);

  /**
   * Get the user's region from the state or fetch it if not available
   * @returns A promise that resolves to the user's region
   */
  const getRegion = async (): Promise<string> => {
    // If the region is already in the state, return it
    if (region.value) {
      return region.value;
    }

    // Otherwise, fetch the region and store it in the state
    const fetchedRegion = await getGeoIp();
    region.value = fetchedRegion;
    return fetchedRegion;
  };

  /**
   * Set the user's region in the state
   * @param value The region value to set
   */
  const setRegion = (value: string): void => {
    region.value = value;
  };

  return {
    region,
    getRegion,
    setRegion,
  };
};
