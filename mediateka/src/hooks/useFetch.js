import { useEffect, useState } from 'react';

/*
 Loader for lists that have 'results' prop in a response
*/
export function useFetchList(func, params, update = []) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    func(params)
      .then(data => {
        if (!data.results) throw 1;
        setData(data.results);
      })
      .catch(() => setError(true));
  }, update);

  return [error, data];
}

/*
 Loader for item object
*/
export function useFetchItem(func, params, update = []) {
  const [data, setData] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    func(params)
      .then(data => {
        if (!data || !data.id) throw 1;
        setData(data);
      })
      .catch(() => setError(true));
  }, update);

  return [error, data];
}
