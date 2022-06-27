import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { InitialStateType } from '../store/reducers'

export async function fetchCount(state: InitialStateType, dispatch: (value: unknown) => void) {
  if (!state.rowService) return
  const { data, error } = await state.rowService.count(state.filters)
  if (error) {
    // TODO: handle fetch rows count error
  } else {
    dispatch({
      type: 'SET_ROWS_COUNT',
      payload: data ?? 0,
    })
  }
}

export async function fetchPage(state: InitialStateType, dispatch: (value: unknown) => void) {
  if (!state.rowService) return
  dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } })
  console.log('Fetch page', {
    filters: state.filters,
    sorts: state.sorts,
  })
  const { data, error } = await state.rowService.fetchPage(
    state.page,
    state.rowsPerPage,
    state.filters,
    state.sorts
  )
  if (error) {
    // TODO: handle fetch rows data error
  } else {
    dispatch({
      type: 'SET_ROWS',
      payload: { rows: data?.rows ?? [] },
    })
  }
  dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } })
}
export const refreshPageDebounced = AwesomeDebouncePromise(fetchPage, 500)
