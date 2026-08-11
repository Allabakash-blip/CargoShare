export default function PrimaryButton({

    children,

    onClick,

    type="button"

}){

    return(

        <button

            type={type}

            onClick={onClick}

            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 hover:shadow-lg"

        >

            {children}

        </button>

    );

}