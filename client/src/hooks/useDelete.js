import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

  const deleteData = async (url) => {
    try {

       const token = localStorage.getItem("token");
       if (!token) {
         throw new Error("Token not found in cookies");
       }

       const headers = {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       };
      const res = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: headers
      });

      if (!res.ok) {
        throw new Error(`Failed to delete data.`);
      }

      const result = await res.json();
      toast.info(result.message);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    } catch (err) {
      toast.error(err.message);
    }
  };


export default deleteData;
