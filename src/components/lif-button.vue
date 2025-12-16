<template>
    <button class="lif-button" @click="handleClick">
        <span class="lif-button__text">{{ buttonText }}</span>
    </button>
</template>

<script>
export default {
    name: "LifButton",
    props: {
        buttonText: {
            type: String,
            required: true,
        },
    },
    methods: {
        handleClick() {
            this.$emit("button-clicked");
        },
    },
};
</script>

<style lang="scss">
.lif-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 24px;
    border-radius: 0!important;
    color: #000000;
    opacity: 1;
    cursor: pointer;
    background-repeat: no-repeat;
    transition: all linear 0.2s;

    span {
        font-family: 'Goudy Trajan', serif;
        font-style: normal;
        font-weight: 700;
        text-transform: uppercase;
    }

    &--disabled {
        filter: brightness(0.5) hue-rotate(10deg) grayscale(1) contrast(1.1) saturate(1.7) opacity(0.93);
        color: #cccccc;
        opacity: 0.7;
        cursor: not-allowed;

        &:hover {
            background-image: url('https://cdn.ltg.com/lif/images/cbt/button-one-row.png')!important;
        }
    }

    &--light {
        background-image: url('https://cdn.ltg.com/lif/images/cbt/button-light.png')!important;

        &:hover {
            opacity: 0.8;
        }
    }

    &--yellow {
        background-image: url('https://cdn.ltg.com/lif/images/cbt/button-one-row.png');

        &:hover {
            background-image: url('https://cdn.ltg.com/lif/images/cbt/button-one-row-hover.png');
        }
    }

    &--small {
        span {
            font-size: 18px;
        }
    }

    &--medium {
        span {
            font-size: 20px;
        }
    }

    &--large {
        span {
            font-size: 22px;
        }
    }

    &--xlarge {
        span {
            font-size: 25px;
        }
    }


}

</style>
