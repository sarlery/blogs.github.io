# git 命令手记
git: 分布式版本控制系统。  

## Git 终端快捷键
Git终端命令遵循Linux命令格式。比如 `touch`、`ls` 等命令都可以使用。 

|快捷键|作用|
|:---|:----|
`ctrl + a`|回到行首|
`ctrl + e`|回到行尾|
`ctrl + l`|清屏|
`echo "文字" > xxx.txt`|向xxx.txt文件中写入内容（会被覆盖）|  

### VI 编辑器命令
使用 `vi 文件名` 打开文件。  
- 保存并退出时，按 `Esc + shift + z + z`；
- 插入文本时，按字母 `i` 键；
- 显示行号时，按 `Esc` 键，然后输入 `:`（英文的冒号），然后再输入 `set number` 回车就会显示行号；
- 定位到第几行，先显示行号，然后在输入 `:` 冒号，在冒号之后跟数字就是第几行（比如：`:10` 表示定位到第十行）；
- 定位到第几行并不能插入，需要点个 `a` 键变成插入模式；  
- 按下 `dd` 可以删除一行（在不是插入模式下）；
- 定位到行区间（比如想删除2~4行中的内容），可以使用 `2,4d` 回车就可以删除；
 
### gitignore 配置
空目录 git 会默认忽略。  
- `dir/` 忽略 dir 目录下的所有文件；
- `dir/*/*.txt` 忽略 dir 目录下的搜有子文件夹里的以 `.txt` 结尾的文件（比如：dir/abc/a.txt 会被忽略；dir/xyz/b.txt 文件会被忽略。）；
- `dir/**/*.txt` dir 目录下任意级别的目录下的 `.txt` 文件都会被忽略；
- `*.php` 会略所有以 `.php` 结尾的文件；
- `!a.txt` 除了 `a.txt` 文件不会被忽略（`!`字符通常与 `*` 连用。比如：`*.txt` `!a.txt` 表示所有以 `.txt` 结尾的文件都会被忽略但除了 `a.txt` 文件）；
 
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

#### Git 工作区操作
工作区有三个：工作区、暂存区、对象区。  
- 当在一个文件夹中执行 `git init` 操作后（默认为主分支），这个文件夹就会成为 git 的本地仓库。文件夹里的内容会被 git 管理。  
- 通过 `git add <file>` 操作就可以将工作区的数据放入暂存区中。
- 通过 `git commit -m "提交说明"` 操作可以将暂存区中的数据存放到对象区中。
- 通过 `git commit -am "提交说明"` 合并 `add` 和 `commit` 操作（将这两个命令合二为一）。
- 通过 `git push` 命令可以将对象区中的内容送入云端服务器中。  

相应的，可以通过以下命令进行版本回退：  
- 通过 `git rm --cached <file>` 命令可以将暂存区的数据会退到工作区。
- 通过 `git checkout -- <file>` 可以将修改的内容再回退到上一次提交的状态；  
  也就是说，使用 `git commit` 提交后，我又修改了这个文件，但我又不想修改了，想要回到修改之前的（commit 时的，还原到已提交的状态）样子，就可以使用该命令。  
- 通过 `git reset head <file>` 命令可以将文件从暂存区回退到工作区。  
  该命令与 `git rm --cached <file>` 命令相同。  
- 通过 `git rm <file>` 可以将已提交的文件删除。删除之后，该文件会被放到暂存区。如果再通过 `git commit` 命令去提交，则这个文件就会被彻底删除。  
  系统命令 `rm` 与 `git rm` 的区别：  
   1. 如果是 `rm` 命令，则该文件会被删除到工作区（如果再进行 `git add` 和 `git commit` 命令，则该文件就会被彻底删除）。  
   
   2. 如果是误删，若是使用 `git rm` 命令删除的，如果是在对象区删的文件，想要还原，需要运行 `git reset HEAD <file>` 命令恢复到工作区，然后运行 `git checkout -- <file>` 命令将删除操作还原。如果是用 `rm` 删除的文件，则可以通过 `git restore <file>` 命令将删除的文件还原到工作区。  
   通过`git rm` 删除对象区的文件还可以先使用 `git restore --staged <file>` 命令将被删除的文件还原到工作区，然后通过 `git restore <file>` 命令将被删除的文件放入对象区。     

  3. 如果将文件重命名（通过 `mv` 命令），重命名其实是移动文件操作，这牵扯到两个文件。如果你后悔这样的操作（想把原来的文件名“赎”回来），则可以使用 `git reset HEAD <原来的文件名>` 命令恢复到工作区，然后使用 `git checkout -- <原来的文件名>` 将原来的文件还原到对象区（这时会有两个文件）。  
   或者也可以使用 `git restore <原来的文件名>` 一次性将原来的文件恢复到对象区。  
   4. 如果使用 `git mv` 命令将文件重名。则可以使用 `git restore --staged <原来的文件名>` 命令，然后使用 `git restore <原来的文件名>` 将原来的文件恢复到对象区。或者先使用 `git reset HEAD <原来的文件名>` 命令在使用 `git checkout -- <原来的文件名>` 将原来的文件还原到对象区。  

- 使用 `git commit --amend -m "修正提交说明"` 命令可以重新编写上一次的提交说明。  

> 工程刚创建的时候不能直接使用 `git commit -am` 命令；

### git log 命令
- `git log`： 查看提交日志；
- `git log -n`： 查看最近几次的提交（比如：`git log -3`,查看最近三次的提交）；
- `git log --pretty=oneline` 提交信息只用一行展示；
- `git log --pretty=format:"%h - %an ,%ar : %s"` 按照自定义格式来显示；  
  + `%h`: 只显示一部分 SHA1 值（每次提交的）；
  + `%an`: 表示作者；
  + `%ar`: 哪个时间提交的；
  + `%s`: 提交说明；  

### 给命令起别名
使用 `git config --global alias.ch checkout` 命令可以给 checkout 命令起一个 `ch` 别名，意思是以后在使用 `git checkout` 命令时，可以直接使用 `git ch` 命令代替。  

## Git 分支
- `git branch` 查看分支；
- `git branch 分支名` 创建分支；
- `git checkout -b 分支名` 创建分支并切换到该分支；
- `git checkout 分支名` 切换分支；
- `git branch -d 分支名` 删除分支（不能删除当前分支、未合并的分支不能删除）；  
  当然，未合并的分支也可以删除（强制删除）：`git branch -D 分支名` 可以强制删除分支。  
- `git merge 分支名` 合并分支 ；
- `git branch -v` 查看所有分支最近一次提交的 `SHA1` 值；

> 需要注意的是：如果分支 a 中进行了写操作，单次操作并没有 `add` 和 `commit`，则在 master 分支中能够看到此操作。如果分支 A 中进行了写操作，并且进行了 commit ，则 master 中无法观察到此文件；  
   > 如果在分支 A 中进行了写操作，单次操作仅限工作区（没有 `add` 和 `commit`），删除分支 A 是可以成功的。  

   ![fast forward](./img/fast&#32;forward.png)

   > 如果一个分支靠前（branch），而另一个落后（比如 master），如果不冲突，则 master 可以通过 `merge` 直接追赶上靠前的那个分支，这种行为叫做 `fast forward`（跳过的中间 commit（归于一点 commit），仍然会保存，而这种方式会丢失分支信息）。  

   ![fast forward](./img/分支合并.png)  

`git merge` 命令默认会使用 `fast forward`。也可以使用 `git merge --no-ff 分支名` 可以不使用 `fast forward`。这种操作不会归于一点 commit（主动合并的分支，会前进一步）；分支信息（可以使用 `git log --graph` 来查看）也不会丢失。  

> 也可以使用 `git log --graph --pretty=oneline --abbrev-commit` 命令更好的显示分支信息。

### 冲突与解决
当两个分支谁都没有落后，但都修改了相应的文件，这个时候就会有冲突。  

![commit 链](./img/commit链.png)

![冲突](./img/冲突.png)  

#### 解决
可以在有冲突的文件中直接进行修改，修改之后先 `git add` 再 `git commit`。  
> 需要注意的是：master 在 merge 时，如果遇到冲突并解决，则解决冲突会进行两次提交，1 次是最终的提交，一次是对方（分支）的提交信息也拿来了。  

## 版本穿梭
- `git reset --hard HEAD^` 回退到前一次提交；  
  `HEAD` 右侧的 `^` 写几次就是回退到前几次（比如：`git reset --hard HEAD^^` 表示回退到倒数第二次）；  
- `git reset --hard HEAD~n` 回退到前 n 次；
- `git reset --hard <SHA1值>` 回退到指定的版本；  
- `git reflog` 查看到所有的操作（当你回退到前 n 次，则 n 之后的版本记录（通过 `git log` 查看）都会没了，如果你又想回退到 n 次后的某个版本（你后悔了），就可以使用 `git reflog` 查看所有的操作然后根据 `SHA1` 值进行回退）；  
- `git branch -m <旧名字> <新名字>` 重命名分支名；


### checkout 游离
> `checkout`: 放弃修改。放弃的是工作区的修改。相对于暂存区或对象区，`checkout` 还可以用于版本回退（游离状态），语法：`git checkout <SHA1>` 游离后如果要修改内容，则必须提交（`commit`）提交后如果要回退到新的版本，你应该创建一个分支。；  

比如：在一个版本控制目录中，有 01.txt 和 02.txt 两个文件，你提交过三次。这时候，你想要使用 `git checkout <SHA1>` 命令回退到第二次提交时状态。  

![ckeckout 游离](./img/checkout游离.png)  

当游离到 `2616f4` 提交节点时，如果你操作了其中的内容（比如修改了文件内容），想要游离到别的提交节点就应该先提交（`commit`）。当 commit 后，在使用 `git checkout <SHA1>` 进行游离时，会报以下的警告：  

![警告](./img/warn.png)  

想要解决，应该创建一个分支使用 `git branch <new-branch-name> <SHA1>` 的形式。这个命令后面还跟了一个 SHA1 字符串，这个 SHA1 字符串是你创建的分支的提交的 SHA1 值。因为在过去修改的内容，对未来没有影响，你回退到未来也没什么用对应当前的修改来说。因此应该创建一个新的分支： `git branch mybr b335297`。

> `reset`：将之前增加到暂存区中的内容回退到工作区；

### stash 保存现场  
1. 建议（规范）：在功能没有开发完毕之前，不要 commit；
2. 规定（必须）：在没有 commit 之前，不能 checkout 切换分支（会报错，想要切换可以使用 `stash` 命令）；

比如这样一个场景：在开发时，你正在写你的分支，但还没有写完（不能 commit），但是项目经理说有另一个分支需要先解决，因此你需要切换分支，切换分支之前你还应该将原来的分支保存起来，但不能 commit。因此可以使用 `stash` 做临时保存（将先解决的分支解决完后再切换回原来的分支，知识后再把临时保存的分支还原回来）。  

#### 命令格式
- `git stash` 将当前的分支临时保存；
- `git stash list` 查看临时保存了多少内容列表（你可以选择性回复）；
- `git stash pop` 还原现场（将原来保存的删除，用于还原内容。当调用完该命令后，再使用 `git stash list` 时不会有保存列表）；
- `git stash save "保存说明"` 可以更清晰的看到你保存现场的说明（直接使用 `git stash` 命令则生成随机的保存说明）；
- `git stash apply` 还原现场（原来保存的不会删除）；
- `git stash drop stash@{0}` 删除保存的现场；  
- `git stash apply stash@{0}` 指定还原第几次现场（默认是最后一次）；  

> 如果不同的分支，在同一个 commit 阶段，在 commit 之前，可以 checkout 切换分支。  

### 标签
tag 标签适用于整个项目，和具体的分支没有关系。  
- `git tag v1.0` 给项目添加版本（简单标签，里面存储着 `commit` 的 SHA1 值）；
- `git tag v1.0 -m "版本说明"` 给标签添加说明文字；
- `git tag` 查看标签；
- `git tag -l "查询字段"` 查找标签；
- `git tag -a v2.0 -m "标签说明"` 存储信息，其中包含了当前的 `commit` 的 `SHA1` 值（一次每次提交就会产生一个新的 SHA1 值）。
- `git tag -d 'v1.0'` 删除标签；
- `git blame <file>` 查看文件的所有的提交 commit SHA1 值，以及作者名；  
- `git show 标签名` 展示某个标签的信息；  

> `git tag v1.0` 和 `git tag -a v1.0 -m "xxxx"` 的区别是，前者的标签信息很少，后者比较多。在新的一次提交后，前者的 commit SHA1 值不会变，而后者会随着当前 `commit` 的 SHA1 值改变而改变。  

使用 `git push origin v1.0`（或者使用 `git push origin --tags` 将全部的标签都提交） 可以将版本提交到 GitHub 上。在 GitHub 上的 release 菜单中，可以看到提交的版本，这就相当于你的项目的版本，每个版本都可以进行下载。  

![GitHub release](./img/git-tag.png)

### diff 命令
diff 命令是 Linux 的命令。可以使用 `diff <file2> <file2>` 命令查看两个文件内容的不同。`diff -u <file1> <file2>` 可以详细查看内容的不同（有+、- 号表示两个文件的不同）。  

Git 中也有 diff 名。他比较的也是文件，但比较的是区中的文件（比如文件暂存区与工作区的区别）。格式：`git diff`。左边是暂存区，右边是工作区。  

- `git diff <SHA1>` 对比对象区与工作区的差异；
- `git diff HEAD` 对比对象区最新一次提交与工作区的差异；
- `git diff --cached <SHA1>` 对比对象区与暂存区的差异；  

## GitHub 远程仓库
从本机到远程使用 `push`，将远程拉取到本地使用 `pull`（拉取 + 合并）。  
push 之前你应该先注册 GitHub，登录。然后通过命令 `git remote add origin <远程仓库地址>` 进行连接远程仓库（`origin` 就是表示远程仓库地址，以后再使用（比如 push 操作时直接使用 `origin`）远程仓库时就可以直接使用 `origin` 字段），然后使用 `git push -u origin master` 将本地仓库推送到远程（第一次执行需要添加参数，后续推送可以直接使用 `git push` 不需要再添加参数）。  

> GitHub 中的远程仓库地址可以使用 HTTPS，使用这个时每次都需要输入密码登录。而使用 SSH 则不需要每次都输入密码。  

### 配置 SSH
本地需要配置私钥，而远程需要配置公钥。通过 `ssh-keygen -t rsa -C "your email"` 生成 SSH key（一路回车）。然后在本机的 `~/user/.ssh` 目录下会生成两个文件，一个公钥（以 `.pub` 后缀结尾）和一个私钥。用记事本打开公钥，复制到 GitHub上。  

> 配置 SSH 是给本地计算机配置的，而不是给计算机中的用户配置的。

你可以将公钥存放在 GitHub 中的两个地方：  
1. 项目的 setting 中，只让当前项目可以和本机免秘钥登录；
2. 账号的 settings 中，账户的所有项目都可以和本机免秘钥登录；  

### 远程操作命令
- `git remote show origin` 显示远程仓库；
- `git remote show` 查询仓库的远程服务器列表（`origin` 就是一个）；
- `git clone <远程项目地址> <下载到本地的仓库名>` 将远程仓库克隆到本地。下载到本地的仓库名可以不指定，不指定时默认是远程仓库名。  
- `git log origin/master` 查看远端的 SHA1 值；

> git 会在本地维护 origin/master 分支，通过该分支感知远程 GitHub 的内容。`origin/master` 一般不建议修改，是一个只读分支。

### 改变指针
使用 `push`、`pull` 可以改变指针。  

当远程仓库更新而本地仓库没有跟进（落后于远程仓库，可能是因为远程被别人 push 了），这时候应该使用 `git pull` 命令（会触发 `Fast-forward`）该命令相当于 `git fetch` + `git merge` 前者是将远程仓库拉下来，而后者是合并分支。  

#### 提交到远程仓库时出现冲突 
你推送时，别的仓库也推送了内容，就会出现冲突。

![git pull 出现冲突](./img/git-pull冲突.png)

这时就应该先把远程的仓库拉下来。这是使用 `git pull` 命令还会报错，因为 `pull` 命令不仅会将仓库内容拉下来，还会与本地仓库合并，因为有冲突，无法合并，因此报错。  
这时，可以打开有冲突的文件进行修改来解决冲突。冲突解决之后别忘了 `add` 和 `commit` 操作。  

### 分支提交
在GitHub中，默认关联的是 master 分支，而如果想向远程中推送别的分支，比如 dev 分支，如何操作呢？  

你只需要使用 `git push -u origin dev` 提交别的分支。或者使用 `git push --set-upstream origin dev` 命令也可以关联分支。  

上面的情况是本地有别的分支，而远程并没有别的分支。如果远程有别的分支，你想要把别的分支拉取下来，如何操作呢？  

第一步应先使用 `git pull` 命令，拉取到的分支是追踪分支，本地仓库并没有。如何将追踪分支变成本地分支？  
- 方法 1： 使用命令 `git checkout -b dev origin/dev`（创建并切换到该分支，当然 `-b` 后的 dev 也可以不叫 dev，这是本地的分支名字，你可以随意改，但最好不要改）  
- 方法 2：使用命令 `git checkout -b dev --track origin/dev`（创建并切换到 dev 分支。`-b dev` 参数可以不写，写了表示切换到该分支）    

你如果想让远端的分支与本地的分支名称不一样，可以使用 `git push origin dev:dev2`（将本地的 dev 推成远端的 dev2 分支）。`git push origin HEAD:dev` 命令中的 `HEAD` 就是 `dev` 分支。  

同样的，使用 `git push origin dev:dev2` 表示将远程分支的 dev 拉到本地，并将 dev 分支关联到本地的 dev2 分支（该命令相当于 `git pull` + `git checkout -b dev2 origin/dev`）。  

如果本地没有 a 分支，但本地却感知远端 a 分支，则可以使用 `git remote prune origin --dry-run` 来检测到 a 这种分支。而使用 `git remote prune origin` 命令可以清空无效的追踪分支（也称本地中感知的远程分支））。  

将远端分支拉取到本地的某个新分支也可以使用别的方法。在本地仓库的 `.git` 目录中有一个 `refs` 目录，该目录中保存着分支信息。  

- 使用 `git fetch origin master:refs/remotes/origin/ms` 拉取远端的一个 master 分支感知到本地的 `ms` 分支当中（运行该命令后，`.git/refs/remotes/origin` 目录下就会多出一个 `ms` 文件）。  

使用 `git push origin 标签名 标签名 标签名` 可以将标签推送到远端。也可以使用 `git push origin --tags` 命令将标签一次性推送完。获取远程标签可以直接使用 `git pull` 只是该命令会将所有的标签都拉下来，使用 `git fetch origin tag v2.0` 可以只将 `v2.0` 的标签拉取下来。  

`git push origin  :v2.0` 可以将远程的标签删除。需要注意的是：如果将远程标签删除，其他用户无法直接感知，还需要通过 `pull` 感知（本地应该也把标签删除）。如果远端是新增标签，则 pull 可以将新增的标签拉取到本地；如果远程是删除标签，则 pull 无法感知。

#### 删除远程分支
使用命令 `git push origin :dev` 可以删除远端的 `dev` 分支（当然你可以在 GitHub 上直接删掉）。或者使用 `git push origin --delete dev` 把远端分支删除；

## Git GUI
使用 `git gui` 命令或者 `gitk` 可以将 git 图形化界面调出。  
 
### 版本库
版本库（version）存在于暂存区和对象区中。

