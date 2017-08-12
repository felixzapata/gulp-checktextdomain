<?php
__( 'Hello World', MY_CUSTOM_CONSTANT );
_x( 'Post', 'verb', MY_CUSTOM_CONSTANT );
_e( 'Hello World', MY_CUSTOM_CONSTANT );
_ex( 'Post', 'verb', MY_CUSTOM_CONSTANT );


esc_html__( 'Hello World', MY_CUSTOM_CONSTANT );
esc_html_e( 'Hello World', MY_CUSTOM_CONSTANT );
esc_html_x( 'Post', 'verb', MY_CUSTOM_CONSTANT );


esc_attr__( 'Hello World', MY_CUSTOM_CONSTANT );
esc_attr_e( 'Hello World', MY_CUSTOM_CONSTANT );
esc_attr_x( 'Post', 'verb', MY_CUSTOM_CONSTANT );


$apples = 4;
_n( '%d apple', '%d apples', $apples, MY_CUSTOM_CONSTANT );
_nx( '%d post', '%d posts', $apples, 'noun, job positions', MY_CUSTOM_CONSTANT );


_n_noop( '%d apple', '%d apples', MY_CUSTOM_CONSTANT );
_nx_noop( '%d post', '%d posts', 'noun, job positions', MY_CUSTOM_CONSTANT );
?>