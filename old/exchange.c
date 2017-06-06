#include <stdio.h>
#include <math.h>
#include <windows.h>

long exchange(long i){
    //处理麻烦的负数对右移造成的影响
    int isNegative = 0;
    if(i>0){
        isNegative = 0;
    }else{
        isNegative = 1;
        i = -i;
    }
    //右/左移的位数
    int bitNum = sizeof(i)*8-16;
    //去头去尾中间位数
    long mid = ((i&(int)(pow(2,bitNum)-1))>>16)<<16;
    long exchanges = (i>>bitNum)|(i<<bitNum)|mid;
    if(isNegative){
        exchanges = -exchanges;
    }
    return exchanges;
}

int main(){
    printf("请输入想交换的数字\n");
    long i;
    scanf("%ld",&i);
    printf("%ld\n",exchange(i));
    system("pause");
    return 0;
}