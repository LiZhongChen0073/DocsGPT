import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActiveState } from '../models/misc';
import {
  setSelectedDocs,
  setSourceDocs,
  selectSourceDocs,
  selectSelectedDocs,
  setSourceIndexes,
  selectSourceIndexes,
  selectSelectedIndexes,
  setSelectedIndexes,
} from './preferenceSlice';
import { getDocs, Doc, getIndexes, Index } from './preferenceApi';

export default function APIKeyModal({
  modalState,
  setModalState,
  isCancellable = true,
}: {
  modalState: ActiveState;
  setModalState: (val: ActiveState) => void;
  isCancellable?: boolean;
}) {
  const dispatch = useDispatch();
  const docs = useSelector(selectSourceDocs);
  const selectedDoc = useSelector(selectSelectedDocs);
  const [localSelectedDocs, setLocalSelectedDocs] = useState<Doc | null>(
    selectedDoc,
  );
  const indexes = useSelector(selectSourceIndexes);
  console.log('indexes', indexes);

  const selectedIndex = useSelector(selectSelectedIndexes);
  const [localSelectedIndexes, setLocalSelectedIndexes] =
    useState<Index | null>(selectedIndex);
  const [isDocsListOpen, setIsDocsListOpen] = useState(false);
  const [isIndexListOpen, setIsIndexListOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  function handleSubmit() {
    if (!localSelectedDocs || !localSelectedIndexes) {
      setIsError(true);
    } else {
      dispatch(setSelectedDocs(localSelectedDocs));
      dispatch(setSelectedIndexes(localSelectedIndexes));
      setModalState('INACTIVE');
      setIsError(false);
    }
  }

  function handleCancel() {
    setIsError(false);
    setModalState('INACTIVE');
  }

  useEffect(() => {
    async function requestDocs() {
      const data = await getDocs();
      dispatch(setSourceDocs(data));
    }
    requestDocs();
  }, []);
  useEffect(() => {
    async function requestIndexes() {
      const data = await getIndexes();
      console.log('getIndexes', data);

      dispatch(setSourceIndexes(data));
    }
    requestIndexes();
  }, []);

  return (
    <div
      className={`${
        modalState === 'ACTIVE' ? 'visible' : 'hidden'
      } absolute z-30  h-screen w-screen  bg-gray-alpha`}
    >
      <article className="mx-auto mt-24 flex w-[90vw] max-w-lg  flex-col gap-4 rounded-lg bg-white p-6 shadow-lg">
        <p className="text-xl text-jet">Select Source Documentation</p>
        <p className="text-lg leading-5 text-gray-500">
          Please select the library of documentation that you would like to use
          with our app.
        </p>
        <div className="relative">
          <div
            className="h-10 w-full cursor-pointer border-b-2"
            onClick={() => setIsDocsListOpen(!isDocsListOpen)}
          >
            {!localSelectedDocs ? (
              <p className="py-3 text-gray-500">Select Documentation</p>
            ) : (
              <p className="py-3">
                {localSelectedDocs.name} {localSelectedDocs.version}
              </p>
            )}
          </div>
          {isDocsListOpen && (
            <div className="absolute top-10 left-0 z-10 max-h-52 w-full overflow-y-scroll bg-white">
              {docs ? (
                docs.map((doc, index) => {
                  if (doc.model) {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setLocalSelectedDocs(doc);
                          setIsDocsListOpen(false);
                        }}
                        className="h-10 w-full cursor-pointer border-x-2 border-b-2 hover:bg-gray-100"
                      >
                        <p className="ml-5 py-3">
                          {doc.name} {doc.version}
                        </p>
                      </div>
                    );
                  }
                })
              ) : (
                <div className="h-10 w-full cursor-pointer border-x-2 border-b-2 hover:bg-gray-100">
                  <p className="ml-5 py-3">No default documentation.</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="relative">
          <div
            className="h-10 w-full cursor-pointer border-b-2"
            onClick={() => setIsIndexListOpen(!isIndexListOpen)}
          >
            {!localSelectedIndexes ? (
              <p className="py-3 text-gray-500">Select Model</p>
            ) : (
              <p className="py-3">
                {localSelectedIndexes.name} {localSelectedIndexes.version}
              </p>
            )}
          </div>
          {isIndexListOpen && (
            <div className="absolute top-10 left-0 z-10 max-h-52 w-full overflow-y-scroll bg-white">
              {indexes ? (
                indexes.map((item, index) => {
                  if (item.model) {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setLocalSelectedIndexes(item);
                          setIsIndexListOpen(false);
                        }}
                        className="h-10 w-full cursor-pointer border-x-2 border-b-2 hover:bg-gray-100"
                      >
                        <p className="ml-5 py-3">
                          {item.name} {item.version}
                        </p>
                      </div>
                    );
                  }
                })
              ) : (
                <div className="h-10 w-full cursor-pointer border-x-2 border-b-2 hover:bg-gray-100">
                  <p className="ml-5 py-3">No default model.</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-row-reverse">
          {isCancellable && (
            <button
              onClick={() => handleCancel()}
              className="ml-5 h-10 w-20 rounded-lg border border-violet-700 bg-white text-violet-800 transition-all hover:bg-violet-700 hover:text-white"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              handleSubmit();
            }}
            className="ml-auto h-10 w-20 rounded-lg bg-violet-800 text-white transition-all hover:bg-violet-700"
          >
            Save
          </button>
          {isError && (
            <p className="mr-auto text-sm text-red-500">
              Please select source documentation and model.
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
