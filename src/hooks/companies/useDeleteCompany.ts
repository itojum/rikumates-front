export const useDeleteCompany = () => {
  const deleteCompany = async (companyId: string) => {
    const response = await fetch(`/api/v1/companies/${companyId}`, {
      method: 'DELETE',
    });

    return response.json();
  };

  return { deleteCompany };
};
