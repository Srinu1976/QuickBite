import React from "react";
import useFetch from "../../hooks/useFetch";
import { BASE_URL } from "../../utils/config";

const Products = () => {
  const { data: specialOnes, loading, error } = useFetch(`${BASE_URL}/food`);
  console.log(specialOnes);

  return (
    <div className="">
      <h1 className="">Products</h1>
    </div>
  );
};

export default Products;
