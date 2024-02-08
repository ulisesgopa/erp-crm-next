const fetcher2 = async ([url, definitionId]: any) => {
    const res = await fetch(`${url}?_definitionId=${definitionId}`);

    return res;
};

export default fetcher2;