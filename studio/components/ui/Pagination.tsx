// @flow
import {useEffect, useState} from "react";
import {Button, IconArrowLeft, IconArrowRight, IconLoader, InputNumber} from "ui";

type Props = {
  total: number,
  pageSize: number,
  loading?: boolean,
  onUpdatePage?: (page: number) => void,
  currentPage?: number,
};
export const Pagination = ({total, pageSize, loading, onUpdatePage, currentPage}: Props) => {
  const [totalPages, setTotalPages] = useState(0);
  const [inputPage, setInputPage] = useState(currentPage || 1);

  useEffect(() => {
    if (currentPage && currentPage !== inputPage) {
      setInputPage(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize));
  }, [total, pageSize]);

  useEffect(() => {
    if (onUpdatePage) {
      onUpdatePage(inputPage);
    }
  }, [inputPage])

  const onPreviousPage = () => {
    if (inputPage > 1) {
      setInputPage(inputPage - 1);
    }
  };
  const onNextPage = () => {
    if (inputPage < totalPages) {
      setInputPage(inputPage + 1);
    }
  }
  const onPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const pageNum = Number(value) > totalPages ? totalPages : Number(value);
    setInputPage(pageNum || 1);
  }
  return (
    <div className="sb-grid-pagination">
      {
        loading ? (
          <p className="text-sm text-scale-1100">正在加载数据...</p>
        ) : (
          <>
            <p className="text-sm text-scale-1100">{`${totalPages} 页中的第`}</p>
            <Button
              icon={<IconArrowLeft />}
              type="outline"
              disabled={loading || inputPage <= 1}
              onClick={onPreviousPage}
              style={{ padding: '3px 10px' }}
            />
            <div className="sb-grid-pagination-input-container">
              <InputNumber
                // [Fran] we'll have to upgrade the UI component types to accept the null value when users delete the input content
                // @ts-ignore
                value={inputPage}
                onChange={onPageChange}
                size="tiny"
                style={{
                  width: '3rem',
                }}
                max={totalPages > 0 ? totalPages : 1}
                min={1}
              />
            </div>
            <Button
              icon={<IconArrowRight />}
              type="outline"
              disabled={loading || inputPage >= totalPages}
              onClick={onNextPage}
              style={{ padding: '3px 10px' }}
            />
            <p className="text-sm text-scale-1100">页</p>
            <p className="text-sm text-scale-1100">{`共 ${total} 条记录`}</p>
            {loading && <IconLoader size={14} className="animate-spin" />}
          </>
        )
      }
    </div>
  );
};
