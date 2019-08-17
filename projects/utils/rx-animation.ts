import { Observable, generate, concat, of, animationFrameScheduler } from 'rxjs';

export function animation(begin, target, duration: number, fn: any): Observable<any> {
  const start = Date.now();
  const iterateFn = () => fn(Date.now() - start, begin, target - begin, duration);

  return concat(
    generate(
      begin,
      x => begin < target ? x < target : x > target,
      iterateFn,
      x => x,
      animationFrameScheduler,
    ),
    of(target),
  );
}
