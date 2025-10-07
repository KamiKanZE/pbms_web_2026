import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { AsyncTypeahead,ClearButton } from 'react-bootstrap-typeahead';
// import { render } from 'react-dom';

import 'react-bootstrap-typeahead/css/Typeahead.css';

const CACHE = {};
const PER_PAGE = 1000;
const SEARCH_URI = process.env.REACT_APP_SOURCE_URL +'/activityLogs/getProject';

function makeAndHandleRequest(query, page = 1) {
  return fetch(`${SEARCH_URI}?project_name=${query}`)
    .then((resp) => resp.json())
    .then((items) => {
      const options = items.map((i) => ({
        id: i.project_id,
        text: i.project_name,
      }));
      return { options };
    });
}
export default function AsyncPaginationExample({selectId,selectName,onSelectValue,onChangeInput}) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState('');

  const handleInputChange = (q) => {
    setQuery(q);
    onChangeInput(q)
  };
  const handlePagination = (e, shownResults) => {
    const cachedQuery = CACHE[query];

    // Don't make another request if:
    // - the cached results exceed the shown results
    // - we've already fetched all possible results
    if (
      cachedQuery.options.length > shownResults ||
      cachedQuery.options.length === cachedQuery.total_count
    ) {
      return;
    }

    setIsLoading(true);

    const page = cachedQuery.page + 1;

    makeAndHandleRequest(query, page).then((resp) => {
      const options = cachedQuery.options.concat(resp.options);
      CACHE[query] = { ...cachedQuery, options, page };

      setIsLoading(false);
      setOptions(options);
    });
  };

  // `handleInputChange` updates state and triggers a re-render, so
  // use `useCallback` to prevent the debounced search handler from
  // being cancelled.
  const handleSearch = useCallback((q) => {
    if (CACHE[q]) {
      setOptions(CACHE[q].options);
      return;
    }

    setIsLoading(true);
    makeAndHandleRequest(q).then((resp) => {
      CACHE[q] = { ...resp, page: 1 };

      setIsLoading(false);
      setOptions(resp.options);
    });
  }, []);

  return (
    <AsyncTypeahead
      id={selectId}
      isLoading={isLoading}
      labelKey="text"
      maxResults={false}
      minLength={3}
      onInputChange={handleInputChange}
      name={selectName}
      // onPaginate={handlePagination}
      onSearch={handleSearch}
      onChange={(e)=>{onSelectValue(e)}}
      options={options}
      paginate={false}
      placeholder="โปรดระบุหรือป้อนอย่างน้อย 3 ตัวอักษรเพื่อค้นหา"
      renderMenuItemChildren={(option) => (
        <div key={option.id}>
          <span>{option.text}</span>
        </div>
      )}
      useCache={false}
    > {({ onClear, selected }) => (
      <div className="rbt-aux">
        {!!selected.length && <ClearButton onClick={onClear} />}
        {!selected.length && <Spinner animation="grow" size="sm" />}
      </div>
    )}
    </AsyncTypeahead>
  );
}
