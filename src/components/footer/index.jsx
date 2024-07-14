import { withTheme } from '@material-ui/core/styles'
import Image from 'next/image'
import Link from 'next/link'

const links = [
  { name: 'Documentation', href: '#' },
  { name: 'Tokenomics', href: '#' },
  { name: 'Disclaimer', href: '#' },
  // { name: 'Jobs', href: '#' },
  // { name: 'Press', href: '#' },
  // { name: 'Accessibility', href: '#' },
  // { name: 'Partners', href: '#' },
]

const logos = [
  {
    name: 'X',
    href: 'https://twitter.com/kodohq',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
  },
  {
    name: 'Medium',
    href: 'https://kodo-exchange.medium.com/',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 -55 256 256" preserveAspectRatio="xMidYMid" className="h-6 w-6">
        <g>
          <path d="M72.2009141,1.42108547e-14 C112.076502,1.42108547e-14 144.399375,32.5485469 144.399375,72.6964154 C144.399375,112.844284 112.074049,145.390378 72.2009141,145.390378 C32.327779,145.390378 0,112.844284 0,72.6964154 C0,32.5485469 32.325326,1.42108547e-14 72.2009141,1.42108547e-14 Z M187.500628,4.25836743 C207.438422,4.25836743 223.601085,34.8960455 223.601085,72.6964154 L223.603538,72.6964154 C223.603538,110.486973 207.440875,141.134463 187.503081,141.134463 C167.565287,141.134463 151.402624,110.486973 151.402624,72.6964154 C151.402624,34.9058574 167.562834,4.25836743 187.500628,4.25836743 Z M243.303393,11.3867175 C250.314,11.3867175 256,38.835526 256,72.6964154 C256,106.547493 250.316453,134.006113 243.303393,134.006113 C236.290333,134.006113 230.609239,106.554852 230.609239,72.6964154 C230.609239,38.837979 236.292786,11.3867175 243.303393,11.3867175 Z"></path>
        </g>
      </svg>
    ),
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/p99hk4actg',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 -28.5 256 256" {...props}>
        <g>
          <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"></path>
        </g>
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/kodo-exchange',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Defillama',
    href: 'https://defillama.com/protocol/kodo-exchange',
    icon: (props) => (
      <svg viewBox="0 0 30 30" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
        <g id="Clip path group">
          <g id="Group">
            <path
              id="Vector"
              d="M28.7448 1.71651C28.6759 1.61964 28.5882 1.53662 28.4864 1.47204C28.2632 1.32542 27.9936 1.25915 27.7248 1.2848C27.456 1.31047 27.2051 1.42642 27.0161 1.61239C25.0526 3.42323 22.7884 3.79445 21.5389 5.474C21.4355 5.25418 21.3046 5.04741 21.149 4.85831C20.787 4.41627 20.2963 4.0884 19.7398 3.91668C19.0999 3.70822 18.4018 3.74056 17.7856 4.00722C17.6075 3.42781 17.2398 2.91942 16.7374 2.55787C16.235 2.19632 15.6247 2.00097 14.9977 2.00097C14.3707 2.00097 13.7604 2.19632 13.258 2.55787C12.7556 2.91942 12.3879 3.42781 12.2098 4.00722C11.6303 3.77095 10.9861 3.72632 10.3775 3.88031C9.769 4.03428 9.2306 4.3782 8.84638 4.85831C8.68647 5.04448 8.55517 5.25183 8.45649 5.474C7.09893 3.68579 4.64216 3.12896 2.59877 1.26379C2.5269 1.18604 2.43976 1.12278 2.34236 1.07769C2.24497 1.03259 2.13927 1.00656 2.03137 1.00109C1.92347 0.995615 1.81552 1.01081 1.71375 1.04581C1.61199 1.0808 1.51843 1.13488 1.4385 1.20495C1.39617 1.23969 1.35832 1.2792 1.32576 1.32265C1.15001 1.55085 1.04078 1.8202 1.00939 2.10278C0.97801 2.38536 1.02561 2.67089 1.14725 2.92976C2.46724 5.93123 4.1912 7.77829 5.46891 9.59815C5.63135 9.8575 5.85353 10.0773 6.11827 10.2406C6.38301 10.4039 6.6832 10.5063 6.99558 10.5398C6.33879 11.5658 5.9012 12.7078 5.70848 13.8989C4.29924 14.2701 3.22353 15.9135 3.22353 17.8919C3.22353 19.6484 4.07377 21.1513 5.26222 21.7172C8.21875 32.6828 23.8883 30.0024 24.7426 22.0024V21.7172C24.8134 21.6856 24.881 21.6477 24.9445 21.6041C26.0297 20.9748 26.7812 19.5442 26.7812 17.8919C26.782 17.6952 26.771 17.4987 26.7484 17.3033C26.5605 15.5921 25.5693 14.2339 24.2963 13.8989C24.1087 12.7065 23.6708 11.5635 23.0092 10.5398C23.3221 10.506 23.6228 10.4035 23.8883 10.2403C24.1537 10.077 24.3768 9.8574 24.5406 9.59815C25.8089 7.78734 27.5234 5.91765 28.8387 2.97504L28.8951 2.84828C28.9828 2.66585 29.0165 2.46361 28.9925 2.26389C28.9684 2.06418 28.8876 1.87474 28.7589 1.71651"
              stroke="currentColor"
              fill="transparent !important"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              id="Vector_2"
              opacity="0"
              d="M28.7448 1.71651C28.6759 1.61964 28.5882 1.53662 28.4864 1.47204C28.2632 1.32542 27.9936 1.25915 27.7248 1.2848C27.456 1.31047 27.2051 1.42642 27.0161 1.61239C25.0526 3.42323 22.7884 3.79445 21.5389 5.474C21.4355 5.25418 21.3046 5.04741 21.149 4.85831C20.787 4.41627 20.2963 4.0884 19.7398 3.91668C19.0999 3.70822 18.4018 3.74056 17.7856 4.00722C17.6075 3.42781 17.2398 2.91942 16.7374 2.55787C16.235 2.19632 15.6247 2.00097 14.9977 2.00097C14.3707 2.00097 13.7604 2.19632 13.258 2.55787C12.7556 2.91942 12.3879 3.42781 12.2098 4.00722C11.6303 3.77095 10.9861 3.72632 10.3775 3.88031C9.769 4.03428 9.2306 4.3782 8.84638 4.85831C8.68647 5.04448 8.55517 5.25183 8.45649 5.474C7.09893 3.68579 4.64216 3.12896 2.59877 1.26379C2.5269 1.18604 2.43976 1.12278 2.34236 1.07769C2.24497 1.03259 2.13927 1.00656 2.03137 1.00109C1.92347 0.995615 1.81552 1.01081 1.71375 1.04581C1.61199 1.0808 1.51843 1.13488 1.4385 1.20495C1.39617 1.23969 1.35832 1.2792 1.32576 1.32265C1.15001 1.55085 1.04078 1.8202 1.00939 2.10278C0.97801 2.38536 1.02561 2.67089 1.14725 2.92976C2.46724 5.93123 4.1912 7.77829 5.46891 9.59815C5.63135 9.8575 5.85353 10.0773 6.11827 10.2406C6.38301 10.4039 6.6832 10.5063 6.99558 10.5398C6.33879 11.5658 5.9012 12.7078 5.70848 13.8989C4.29924 14.2702 3.22353 15.9135 3.22353 17.8919C3.22353 19.6484 4.07377 21.1513 5.26222 21.7172C8.21875 32.6828 23.8883 30.0024 24.7426 22.0024V21.7172C24.8134 21.6856 24.881 21.6477 24.9445 21.6041C26.0297 20.9748 26.7812 19.5442 26.7812 17.8919C26.782 17.6952 26.771 17.4987 26.7484 17.3033C26.5605 15.5921 25.5693 14.2339 24.2963 13.8989C24.1087 12.7065 23.6708 11.5635 23.0092 10.5398C23.3221 10.506 23.6228 10.4035 23.8883 10.2403C24.1537 10.077 24.3768 9.8574 24.5406 9.59815C25.8089 7.78734 27.5234 5.91765 28.8387 2.97504L28.8951 2.84828C28.9828 2.66585 29.0165 2.46361 28.9925 2.26389C28.9684 2.06418 28.8876 1.87474 28.7589 1.71651"
              fill="currentColor"
            ></path>
            <path
              id="Vector_3"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.7806 18.5622L16.2164 19.9475C16.0815 20.07 15.9854 20.227 15.9392 20.4001C15.8359 20.7985 15.6339 21.5818 15.4695 22.3241C15.4437 22.4246 15.3831 22.5135 15.2976 22.5761C15.2122 22.6388 15.107 22.6713 14.9997 22.6682C14.8924 22.6713 14.7873 22.6388 14.7018 22.5761C14.6163 22.5135 14.5557 22.4246 14.53 22.3241L14.032 20.4001C13.9881 20.2262 13.8917 20.0686 13.7549 19.9475L12.1906 18.5622C12.1031 18.4773 12.054 18.3626 12.054 18.243C12.054 18.1234 12.1031 18.0086 12.1906 17.9238C12.2411 17.8719 12.3035 17.8321 12.3729 17.8077C12.4422 17.7833 12.5166 17.775 12.5899 17.7835L14.9386 18.0913H15.0655L15.2487 18.0687L17.4142 17.7835C17.51 17.7742 17.6065 17.7936 17.6905 17.839C17.7745 17.8843 17.8421 17.9534 17.8839 18.037C17.9262 18.1243 17.9385 18.2222 17.9191 18.3166C17.8997 18.4111 17.8495 18.497 17.7759 18.5622M20.1246 18.0551C20.1344 17.0819 20.4168 16.1293 20.942 15.2981C21.0771 15.0734 21.1604 14.8232 21.1864 14.5646C21.2123 14.306 21.1802 14.0452 21.0923 13.7996L20.9843 13.8947C20.5071 14.2561 19.919 14.4549 19.3121 14.4599C18.7052 14.4648 18.1137 14.2756 17.6303 13.9219C17.6303 14.8454 16.7566 15.624 15.5916 15.7508C15.4712 15.7597 15.3503 15.7597 15.2299 15.7508C13.9099 15.7508 12.8342 14.9178 12.8342 13.8902C12.3508 14.2439 11.7593 14.4331 11.1524 14.4281C10.5455 14.4232 9.95741 14.2245 9.48021 13.863C9.34871 13.7574 9.23051 13.6374 9.12791 13.5054C8.93155 13.7768 8.81783 14.0957 8.79956 14.426C8.7813 14.7564 8.85924 15.0851 9.02461 15.3751C9.48121 16.1994 9.71701 17.1206 9.71041 18.0551C9.71371 19.028 9.44431 19.9837 8.93062 20.8212C8.74022 21.1396 8.65488 21.5064 8.68592 21.8726C8.71697 22.2389 8.86293 22.5875 9.10441 22.8719C10.4526 24.4338 12.6087 25.733 14.6709 25.9051H15.1782C17.5645 25.9051 19.4388 24.4745 20.7776 22.5913C20.9679 22.3185 21.0762 22.0002 21.0903 21.6718C21.1044 21.3434 21.0238 21.0176 20.8574 20.7306C20.3959 19.9105 20.1537 18.9926 20.1528 18.0596"
              fill="currentColor"
            ></path>
            <path
              id="Vector_4"
              opacity="0"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.7813 18.5617L16.217 19.947C16.0821 20.0697 15.986 20.2267 15.9399 20.3997C15.8365 20.7981 15.6345 21.5813 15.4701 22.3237C15.4444 22.4242 15.3837 22.5131 15.2983 22.5757C15.2128 22.6383 15.1077 22.6708 15.0004 22.6678C14.8931 22.6708 14.7879 22.6383 14.7024 22.5757C14.617 22.5131 14.5563 22.4242 14.5306 22.3237L14.0327 20.3997C13.9888 20.2257 13.8923 20.0682 13.7555 19.947L12.1913 18.5617C12.1038 18.4769 12.0547 18.3621 12.0547 18.2425C12.0547 18.1229 12.1038 18.0082 12.1913 17.9234C12.2417 17.8714 12.3041 17.8316 12.3735 17.8072C12.4429 17.7828 12.5173 17.7745 12.5906 17.783L14.9393 18.0909H15.0661L15.2493 18.0683L17.4149 17.783C17.5107 17.7738 17.6071 17.7931 17.6911 17.8385C17.7752 17.8838 17.8427 17.953 17.8846 18.0366C17.9269 18.1238 17.9392 18.2217 17.9198 18.3162C17.9003 18.4106 17.8502 18.4967 17.7766 18.5617"
              fill="currentColor"
            ></path>
          </g>
        </g>
      </svg>
    ),
  },
  {
    name: 'Warpcast',
    href: 'https://warpcast.com/kodohq',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 1000 1000" className="h-6 w-6" aria-hidden="true">
        <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"></path>
        <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"></path>
        <path d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z"></path>
      </svg>
    ),
  },
]

// kodoex is a liquidity public good for Taiko.
function Footer(props) {
  return (
    <div className="flex flex-col items-center">
      <img className="w-full h-px mt-16" src={'/img/line-footer.png'} />
      <div className="cursor-pointer mt-12">
        <Link href="/swap">
          <img className="h-8 w-auto" src={'/logo.svg'} />
        </Link>
      </div>
      <ul className="mt-10 group flex list-none items-center justify-center">
        <li>
          <a
            className="inline-flex items-center bg-transparent text-base font-medium text-[rgba(128,128,136,1)] transition-colors hover:text-white h-10 px-3 py-1 group w-max"
            href="https://docs.kodo.exchange/overview/legal-disclaimer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Disclaimer
          </a>
        </li>
        <li>
          <a
            className="inline-flex items-center bg-transparent text-base font-medium text-[rgba(128,128,136,1)] transition-colors hover:text-white h-10 px-3 py-1 group w-max"
            href="https://docs.kodo.exchange"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
        </li>
        <li>
          <a
            className="inline-flex items-center bg-transparent text-base font-medium text-[rgba(128,128,136,1)] transition-colors hover:text-white h-10 px-3 py-1 group w-max"
            href="https://docs.kodo.exchange/overview/tokenomics"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tokenomics
          </a>
        </li>
      </ul>
      <div className="mt-12 flex justify-center items-center space-x-6">
        {logos.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[rgba(128,128,136,1)] hover:text-white transition-colors"
          >
            <span className="sr-only">{item.name}</span>
            <item.icon className="h-6 w-6" aria-hidden="true" />
          </a>
        ))}
      </div>
      <img className="w-full h-px mt-12" src={'/img/line-footer.png'} />
      <div className="mt-6 flex flex-row justify-between space-x-2">
        <span className="text-[rgba(128,128,136,1)] whitespace-nowrap leading-4 font-normal font-sans text-[13px]">
          A public good for
        </span>
        <a
          href="https://taiko.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-70 hover:opacity-100 transition"
        >
          {/* <img src="/taiko/taiko-h-wht.svg" className="w-14" /> */}
          <img className="w-14 h-4" src={'/img/taiko-h-wht.svg'} />
        </a>
      </div>
      <span className="text-[rgba(128,128,136,1)] text-left whitespace-nowrap leading-4 mt-3 mb-6 font-normal font-sans text-[13px]">
        © 2024, KODO | 鼓動
      </span>
    </div>
  )
}

export default withTheme(Footer)
