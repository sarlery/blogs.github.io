#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void fn(){
    for(int i = 1;i < 10;i ++){
        for(int j = 1;j <= i;j ++){
            printf("%d * %d = %d \t",i,j,i * j);
        }
        printf("\n");
    }
}

int main(){
    fn();

    return 1;
}