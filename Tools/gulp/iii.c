#include <pthread.h>

int pthread_create(
    pthread_t * restrict thread,
    const pthread_attr_t * restrict attr,
    void * (* start_routine)(void *),
    void * restrict arg
);
