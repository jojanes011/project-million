'use client';

import { useQuery } from '@tanstack/react-query';
import { getPropertyTraces } from '@/lib/api/properties';

const PROPERTY_TRACES_QUERY_KEY = 'propertyTraces';

export const usePropertyTraces = (propertyId: string) => {
    return useQuery({
        queryKey: [PROPERTY_TRACES_QUERY_KEY, propertyId],
        queryFn: () => getPropertyTraces(propertyId),
        enabled: !!propertyId, // Only run the query if propertyId is available
    });
};
