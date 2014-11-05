#!/bin/sh

# To setup a pre-commit git hook to use JavaScript linting:
#
# cat > .git/hooks/pre-commit <<EOF
# !/bin/sh
# ./script/git-pre-commit-jshint.sh
# EOF
# chmod +x .git/hooks/pre-commit

files=$(git diff --cached --name-only --diff-filter=ACM | grep ".js$" | grep "assets/js")
if [ "$files" = "" ]; then
    exit 0
fi

pass=true

echo "\nLinting JavaScript:\n"

for file in ${files}; do
    result=$(node_modules/.bin/jshint ${file} && node_modules/.bin/jscs ${file})
    if [ "$result" == "" ]; then
        echo "\033[32m${file}: OK\033[0m"
    else
        echo "\033[31m${result}\033[0m"
        pass=false
    fi
done

echo "\nJavaScript linting complete\n"

if ! $pass; then
    echo "\033[41m FAIL: \033[0m Your commit contains files that should pass JavaScript linting but do not. Please fix the violations and try again.\n"
    exit 1
else
    echo "\033[42m OK \033[0m\n"
fi
