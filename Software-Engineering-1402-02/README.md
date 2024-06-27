# Software-Engineering-1402-02

Software engineering microservice project

# How to submit your project?

_Please ensure that you read the following information before issuing a pull request. Also refer back to this document
as
a checklist before issuing your pull request.
This will save time for everyone._

## Before You Start

### Understanding the Basics

If you don't understand what a *pull request* is, or how to submit one, please refer to
the [help documentation](https://help.github.com/articles/about-pull-requests/)
provided by GitHub.

### Coding standards

Please ensure you follow the coding standards used throughout the existing code base.
You are free to use any language but keep in mind:

- Follow the principles of clean coding.
- Names should be clear and meaningful. Use Intention-Revealing names. The name of a variable should be sufficient to
  understand its purpose. Don't be afraid of long names.
- Functions must be coherent. Keep related parts close together and move from the general to the specifics.
  Approach each function as if it were a narrative, crafted to guide the reader smoothly from start to finish.
- keep functions small. even smaller.
- Try to make meaningful commits and branches.
- You are the authors! Do respect your audience.

### Structure Guidelines

In the main branch of the repo in `src` directory, there is a folder for each team. Each folder is for a separate project.
Please just change your folder and put all the items related to your project in the same folder.
If you need to change the rest of the sections, please ensure [coordination first](#question-or-problem).

### Question or Problem?

Your inquiries and feedback are always welcome. For any questions or concerns,
please reach out via Telegram to: @mrzhashemian.

## Submitting a Pull Request

The following are the general steps you should follow in creating a pull request. Subsequent pull requests only need
to follow step 3 and beyond:

1. Fork the repository on GitHub
2. Clone the forked repository to your machine
3. Create a new branch from the `main` branch for your fork for the contribution
4. Make your changes using descriptive commit messages to your local repository
5. Push your commits to your GitHub remote fork repository
6. Issue a Pull Request to the official repository targeting the `main` branch
7. Your Pull Request is reviewed by a committer and merged into the repository

*Note* While there are other ways to accomplish the steps using other tools, the examples here will assume the most
actions will be performed via the `git` command line.

### 1. Fork the Repository

When logged into your GitHub account, and you are viewing one of the main repositories, you will see the *Fork* button.
Clicking this button will show you which repositories your can fork to. Choose your own account. Once the process
finishes, you will have your own repository that is "forked" from the GitHub one.

Forking is a GitHub term and not a git term. Git is a wholly distributed source control system and simply worries
about local and remote repositories and allows you to manage your code against them. GitHub then adds this additional
layer of structure of how repositories can relate to each other.

For more information on maintaining a fork, please see the GitHub Help
article [Fork a Repo](https://help.github.com/articles/fork-a-repo).

### 2. Clone the Forked Repository

Once you have successfully forked your repository, you will need to clone it locally to your machine:

```bash
$ git clone git@github.com:YOUR-USERNAME/Software-Engineering-1402-02.git
```

This will clone your fork to your current path in a directory named `Software-Engineering-1402-02`.

You should also set up the `upstream` repository to sync your fork with the upstream repository. This will allow you to
take changes
and merge them into your local clone and then push them to your fork repository:

```bash
$ cd Software-Engineering-1402-02
$ git remote add upstream git@github.com:MajidNami/Software-Engineering-1402-02.git
$ git fetch upstream
```

Then you can retrieve upstream changes and rebase on them into your code like this:

```bash
$ git pull --rebase upstream main
```

For more information on rebasing, see [rebasing](http://git-scm.com/book/en/Git-Branching-Rebasing) from git.

### 3. Create a Branch

The easiest workflow is to keep your main branch in sync with the upstream branch and do not locate any of your own
commits in that branch. When you want to work on a new feature, you then ensure you are on the main branch and create
a new branch from there. While the name of the branch can be anything, it is highly recommended to use clear and
conceptual naming.

```bash
$ git checkout -b adding-feature-y-on-project-x main
Switched to a new branch 'adding-feature-y-on-project-x'
```

You will then be on the feature branch. You can verify what branch you are on like this:

```bash
$ git status
On branch adding-feature-y-on-project-x
nothing to commit, working directory clean
```

### 4. Make Changes and Commit

Now you just need to make your changes. Once you have finished your changes (and tested them) you need to commit them
to your local repository (assuming you have staged your changes for committing):

```bash
$ git status
# On branch adding-feature-y-on-project-x
# Changes to be committed:
#   (use "git reset HEAD <file>..." to unstage)
#
#        modified:   some_file.go
#
$ git commit -m "Add feature y"
 1 file changed, 2 insertions(+), 2 deletions(-)
```

### 5. Rebase and Push Changes

If you have been working on your contribution for a while, the upstream repository may have changed. You may want to
ensure your work is on top of the latest changes so your pull request can be applied cleanly:

```bash
$ git pull --rebase upstream main
```

When you are ready to push your commit to your GitHub repository for the first time on this branch you would do the
following:

```bash
$ git push -u origin adding-feature-y-on-project-x
```

After the first time, you simply need to do:

```bash
$ git push
```

### 6. Issue a Pull Request

In order to have your commits merged into the main repository, you need to create a pull request. The instructions for
this can be found in the GitHub Help
Article [Creating a Pull Request](https://help.github.com/articles/creating-a-pull-request). Essentially you do the
following:

1. Go to the site for your repository.
2. Click the Pull Request button.
3. Select the feature branch from your repository.
4. Enter a title and description of your pull request.
5. Review the commit and files changed tabs.
6. Click `Send Pull Request`

You will get notified about the status of your pull request based on your GitHub settings.

### 7. Request is Reviewed and Merged

Your request will be reviewed. It may be merged directly, or you may receive feedback or questions on your pull
request.
