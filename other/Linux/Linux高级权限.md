# Linux 高级权限管理

## ACL 权限

该权限是为了解决用户身份不足的情况。  

- `dumpe2fs` 命令是查询指定分区详细文件系统信息的命令。  
  选项：`-h` 仅显示超级块中的信息，而不显示磁盘块组的详细信息。  

- `df -lh` 命令可以查看系统分区以及他们的使用情况。  

**`mount -o remount acl /`** 命令可以临时开启分区 ACL 权限。  

### 永久开启 ACL 权限
1. 打开文件：`vi /etc/fstab`。  
2. 将其中的一行 `UUID=c2cabf57-xxxx-xxxx-xxxx / ext4 default 1 1`，改为：`UUID=c2cabf57-xxxx-xxxx-xxxx / ext4 default , acl 1 1`。  

3. 修改后，运行 `mount -o remount /` 重新挂载文件系统或重启系统，使修改生效。  


