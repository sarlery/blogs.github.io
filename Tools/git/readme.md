# git 命令手记
git: 分布式版本控制系统。  

## Git 终端快捷键
Git终端命令遵循Linux命令格式。比如 `touch`、`ls` 等命令都可以使用。  
|快捷键|作用|
|:---|:----|
`ctrl + a`|回到行首|
`ctrl + e`|回到行尾|
`echo "文字" > xxx.txt`|向xxx.txt文件中写入内容（会被覆盖）|  

### VI 编辑器命令
使用 `vi 文件名` 打开文件。  
- 保存并退出时，按 `Esc + shift + z + z`；
- 插入文本时，按字母 `i` 键；
- 显示行号时，按 `Esc` 键，然后输入 `:`（英文的冒号），然后再输入 `set number` 回车就会显示行号；
- 定位到第几行，先显示行号，然后在输入 `:` 冒号，在冒号之后跟数字就是第几行（比如：`:10` 表示定位到第十行）；
- 定位到第几行并不能插入，需要点个 `a` 键变成插入模式；

## Git 优势
1. 实现本地版本控制；
2. 重写提交说明；
3. 可以“后悔”（每一次操作基本可以再还原）；
4. 具有分支系统；
5. 全量（更改一处文件，其他各处文件（包括没有更改的）都会被添加到新的版本仓库中，时刻保证数据的完整性，保证了版本回退的容易）；  

## Git 三种状态
1. 已修改（modified）
2. 已暂存（staged）
3. 已提交（commited）  

### Git 工作区
### 设置邮箱、用户名
使用 Git 之前需要先配置用户名和邮箱。  
设置邮箱、用户名有三种方式：`global`、`system`、`local`。  
- `git config --global user.name "your name"` 给整个计算机一次性设置；
- `git config --system user.name "your name"` 给当前的系统用户一次性设置；
- `git config --local user.name "your name"` 给当前项目（项目目录中）一次性设置；  

> 最好使用 system 方式设置。如果使用 global 方式，则计算机当中所有的用户都可以控制 git。  

设置邮箱：`git config --system user.email "your email"`。  

在 `.gitconfig` 文件（如果是local方式则该文件在项目目录的.git文件夹中；如果是system方式则在用户（user）文件夹当中）中可以查看邮箱、名字的信息，甚至可以修改（最好不要那么做）。  

> 如果同时设置，则越近优先级越高（local > system > global）。  

#### 删除邮箱用户名
使用命令 `git config --system --unset user.name` 命令来删除名字；通过 `git config --system --unset user.email` 命令来删除邮箱。  

工作区有三个：工作区、暂存区、对象区。  
- 当在一个文件夹中执行 `git init` 操作后（默认为主分支），这个文件夹就会成为 git 的本地仓库。文件夹里的内容会被 git 管理。  
- 通过 `git add <file>` 操作就可以将工作区的数据放入暂存区中。
- 通过 `git commit -m "提交说明"` 操作可以将暂存区中的数据存放到对象区中。
- 通过 `git push` 命令可以将对象区中的内容送入云端服务器中。  

相应的，可以通过以下命令进行版本回退：  
- 通过 `git rm --cached <file>` 命令可以将暂存区的数据会退到工作区。
- 通过 `git checkout -- <file>` 可以将修改的内容再回退到上一次提交的状态；  
  也就是说，使用 `git commit` 提交后，我又修改了这个文件，但我又不想修改了，想要回到修改之前的（commit 时的，还原到已提交的状态）样子，就可以使用该命令。  
- 通过 `git reset head <file>` 命令可以将文件从暂存区回退到工作区。  
  该命令与 `git rm --cached <file>` 命令相同。  

### git log 命令
- `git log`： 查看提交日志；
- `git log -n`： 查看最近几次的提交（比如：`git log -3`,查看最近三次的提交）；
- `git log --pretty=oneline` 提交信息只用一行展示；
- `git log --pretty=format:"%h - %an ,%ar : %s"` 按照自定义格式来显示；  
  + `%h`: 只显示一部分 SHA1 值（每次提交的）；
  + `%an`: 表示作者；
  + `%ar`: 哪个时间提交的；
  + `%s`: 提交说明；  

### 版本库
版本库（version）存在于暂存区和对象区中。

