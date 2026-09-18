import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | string;
  className?: string;
}

export declare const Button: React.FC<ButtonProps>;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export declare const Card: React.FC<CardProps>;

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: string;
  className?: string;
}

export declare const StatusBadge: React.FC<StatusBadgeProps>;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export declare const Input: React.FC<InputProps>;

export declare const UI_VERSION: string;
