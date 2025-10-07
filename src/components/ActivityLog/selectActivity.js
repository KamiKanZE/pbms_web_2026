import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { ClearButton, Typeahead } from 'react-bootstrap-typeahead';
// import options from './data';
const SEARCH_URI = process.env.REACT_APP_SOURCE_URL + '/activityLogs/getActivity';

function Ssss({ selectId, selectName, onChange, onInput,options }) {
    return (
        <Typeahead
            id={selectId}
            name={selectName}
            options={options}
            onChange={(e) => onChange(e)}
            placeholder="Choose a state...">
            {({ onClear, selected }) => (
                <div className="rbt-aux">
                    {!!selected.length && <ClearButton onClick={onClear} />}
                    {/* {!selected.length && <Spinner animation="grow" size="sm" />} */}
                </div>
            )}
        </Typeahead>)
}
export default function SelectActivity(data) {
    const { selectId, selectName, onSelectValue, onChangeInput, dataId } = data
    const [options, setOptions] = useState([]);
    useEffect(() => {
        fetch(`${SEARCH_URI}?project_id=${dataId}`)
            .then((resp) => resp.json())
            .then((items) => {
                const options = items.map((i) => ({
                    label: i.activity_detail,
                }));
                setOptions(options);
            });
    }, [dataId]);
    return (
        // <Ssss selectId={selectId} selectName={selectName} options={options} onChange={onSelectValue} onInput={onChangeInput} />
        <div>
        <Typeahead
            id={selectId}
            name={selectName}
            options={options}
            onChange={(e) => onSelectValue(e)}
            placeholder="Choose a state...">
            {({ onClear, selected }) => (
                <div className="rbt-aux">
                    {!!selected.length && <ClearButton onClick={onClear} />}
                    {!selected.length && <Spinner animation="grow" size="sm" />}
                </div>
            )}
        </Typeahead>
        </div>
    );
}