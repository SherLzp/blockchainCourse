cmake_minimum_required(VERSION 2.8)

project(SHA256)

add_executable(SHA256 SHA256.cpp main.cpp)
add_executable(PoW_demo SHA256.cpp PoW_demo.cpp)
