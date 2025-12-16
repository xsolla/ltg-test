<script setup>
defineProps({
    social: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <li v-if="social" class="social__item">
        <a :href="social.link" target="_blank" class="social__link">
            <component :is="social.icon" />
        </a>
    </li>
</template>

<style scoped lang="scss">
.social__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;

    &:first-child {
        &:before {
            content: "";
            position: absolute;
            top: 50%;
            left: -260px;
            transform: translateY(-50%) rotate(180deg);
            width: 230px;
            height: 30px;
            background-image: url("https://cdn.ltg.com/lif/images/arden/social-decor.svg");
            background-repeat: no-repeat;
            background-position: center top;

            @media screen and (max-width: 1024px){
                display: none;
            }
        }
    }

    &:last-child {
        &:after {
            content: "";
            position: absolute;
            top: 50%;
            right: -260px;
            transform: translateY(-50%);
            width: 230px;
            height: 30px;
            background-image: url("https://cdn.ltg.com/lif/images/arden/social-decor.svg");
            background-repeat: no-repeat;
            background-position: center top;

            @media screen and (max-width: 1024px){
                display: none;
            }
        }
    }

    @media screen and (max-width: 1024px){
        width: 30px;
        height: 30px;
    }
}

.social__link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    svg {
        fill: #ffffff;
        transition: fill linear 0.2s;
    }

    &:hover {
        svg {
            fill: #db9909;
        }
    }
}
</style>
