# 进程与线程

## 进程间通信

`IPC` 的全称是 Inter-Process Communication，即进程间通信。进程间通信的目的是为了让不同的进程能够互相访问资源并进行协调工作。实现进程间通信的技术有很多，如命名管道、匿名管道、socket、信号量、共享内存、消息队列、Domain、Socket 等。Node 中实现 IPC 通道的是管道（pipe）技术。但此管道非彼管道，在Node中管道是个抽象层面的称呼，具体细节实现由 libuv 提供，在 Windows 下由命名管道（named pipe）实现，*nix系统则采用 Unix Domain Socket 实现。  

