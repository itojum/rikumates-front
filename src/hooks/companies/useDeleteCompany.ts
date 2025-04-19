export const useDeleteCompany = () => {
  const deleteCompany = async (id: string) => {
    const response = await fetch(`/api/v1/companies/${id}`, {
      method: 'DELETE',
    });

    return response.json();
  };

  return { deleteCompany };
};
