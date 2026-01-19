import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductImageBlob } from "@/services/api/productImages";

export function useProductImageQuery({ productId, type, enabled = true }) {
  const [objectUrl, setObjectUrl] = useState(null);

  const query = useQuery({
    queryKey: ["product-image", productId, type],
    queryFn: () => fetchProductImageBlob({ productId, type }),
    enabled: Boolean(productId && type) && enabled, // ✅ 추가
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });

  useEffect(() => {
    // ✅ enabled가 꺼지거나 data가 없어졌을 때 objectUrl 정리
    if (!query.data) {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }
      return;
    }

    const url = URL.createObjectURL(query.data);
    setObjectUrl(url);

    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return {
    ...query,
    objectUrl,
  };
}
